import express, { type Request, type Response } from 'express';
import { param } from '@prisma/orm-postgres/relational-core/expression';
import { SqlQueryError } from '@prisma/orm-family-sql/errors';
import { db } from './prisma/db.js';
import { CreateAcquisitionRequest, type CreateItemRequest } from './types.js';

const app = express();
const port = 3000;

app.use(express.json());

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

const money = (value: number) => param(value.toFixed(2), { codecId: 'pg/numeric@1' });
const purchaseDate = (value: Date) => param(value.toISOString().slice(0, 10), { codecId: 'pg/date-string@1' });
const asMoney = (value: string): number => Number(value);
const ensureSupplier = async (tx: Tx, requestedName: string): Promise<string> => {
  const supplier = tx.sql.public.supplier;
  const lookup = tx.raw.sql`
    SELECT name FROM supplier WHERE LOWER(name) = LOWER(${requestedName})
  `
    .returnsRow({ name: supplier.columns.name })
    .build();

  const [found] = await tx.query(lookup);
  if (found) return found.name;

  const inserted = tx.raw.sql`
    INSERT INTO supplier (name)
    VALUES (${requestedName})
    ON CONFLICT DO NOTHING
    RETURNING name
  `
    .returnsRow({ name: supplier.columns.name })
    .build();

  const [created] = await tx.query(inserted);
  if (created) return created.name;

  const [raced] = await tx.query(lookup);
  if (raced) return raced.name;

  throw new Error('Failed to resolve supplier name.');
}

const insertAcquisition = async (tx: Tx, body: CreateAcquisitionRequest, supplierName: string) => {
  const acquisition = tx.sql.public.acquisition;
  const plan = tx.raw.sql`
    INSERT INTO acquisition (supplier_name, purchase_date, purchase_price, freight_cost, manifest, notes)
    VALUES (
      ${supplierName},
      ${purchaseDate(body.purchase_date)},
      ${money(body.purchase_price)},
      ${money(body.freight_cost ?? 0)},
      ${param(body.manifest ?? null, { codecId: 'pg/jsonb@1' })},
      ${param(body.notes ?? null, { codecId: 'pg/text@1' })}
    )
    RETURNING id, supplier_name, purchase_date, purchase_price, freight_cost, manifest, notes, created_at, updated_at
  `
    .returnsRow({
      id: acquisition.columns.id,
      supplier_name: acquisition.columns.supplier_name,
      purchase_date: acquisition.columns.purchase_date,
      purchase_price: acquisition.columns.purchase_price,
      freight_cost: acquisition.columns.freight_cost,
      manifest: acquisition.columns.manifest,
      notes: acquisition.columns.notes,
      created_at: acquisition.columns.created_at,
      updated_at: acquisition.columns.updated_at
    })
    .build();

  const [row] = await tx.query(plan);
  if (!row) throw new Error('Acquisition insert returned no row.');

  return {
    ...row,
    purchase_price: asMoney(row.purchase_price),
    freight_cost: asMoney(row.freight_cost)
  };
}

const insertItem = async (tx: Tx, acquisitionId: number, item: CreateItemRequest) => {
  const itemTable = tx.sql.public.item;
  const plan = tx.raw.sql`
    INSERT INTO item (acquisition_id, name, sku, condition, allocated_cost, status)
    VALUES (
      ${acquisitionId},
      ${item.name},
      ${item.sku},
      CAST(${item.condition} AS item_condition),
      ${money(item.allocated_cost)},
      CAST(${item.status} AS item_status)
    )
    RETURNING id, acquisition_id, name, sku, condition::text AS condition, allocated_cost, status::text AS status, created_at, updated_at
  `
    .returnsRow({
      id: itemTable.columns.id,
      acquisition_id: itemTable.columns.acquisition_id,
      name: itemTable.columns.name,
      sku: itemTable.columns.sku,
      condition: 'pg/text@1',
      allocated_cost: itemTable.columns.allocated_cost,
      status: 'pg/text@1',
      created_at: itemTable.columns.created_at,
      updated_at: itemTable.columns.updated_at
    })
    .build();

  const [row] = await tx.query(plan);
  if (!row) throw new Error('Item insert returned no row.');

  return {
    ...row,
    allocated_cost: asMoney(row.allocated_cost)
  };
}

app.post('/acquisition', async (req: Request, res: Response) => {
  const parsed = CreateAcquisitionRequest.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request', issues: parsed.error.issues });
    return;
  }

  try {
    const created = await db.transaction(async (tx) => {
      const supplierName = await ensureSupplier(tx, parsed.data.supplier_name);
      const acquisition = await insertAcquisition(tx, parsed.data, supplierName);
      const items = [];
      for (const item of parsed.data.items) {
        items.push(await insertItem(tx, acquisition.id, item));
      }
      return { acquisition, items };
    });

    res.status(201).json(created);
  } catch (error) {
    if (SqlQueryError.is(error)) {
      if (error.sqlState === '23505') {
        res.status(409).json({ error: 'A unique value already exists.' });
        return;
      }
      if (error.sqlState === '23514') {
        res.status(400).json({ error: 'A value violates a database constraint.' });
        return;
      }
    }

    console.error(error);
    res.status(500).json({ error: 'Failed to create acquisition.' });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

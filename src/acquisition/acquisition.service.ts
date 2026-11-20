import { param } from '@prisma/orm-postgres/relational-core/expression';

import type { CreateItemRequest } from '../item/item.schema.js';
import { db, type Tx } from '../prisma/db.js';
import { getSupplierName } from '../supplier/supplier.service.js';
import type { CreateAcquisitionRequest } from './acquisition.schema.js';

const money = (value: number) => param(value.toFixed(2), { codecId: 'pg/numeric@1' });
const purchaseDate = (value: Date) => param(value.toISOString().slice(0, 10), { codecId: 'pg/date-string@1' });
const asMoney = (value: string): number => Number(value);

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
};

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
};

export const createAcquisition = async (body: CreateAcquisitionRequest) => {
  return db.transaction(async (tx) => {
    const supplierName = await getSupplierName(tx, body.supplier_name);
    const acquisition = await insertAcquisition(tx, body, supplierName);
    const items = [];
    for (const item of body.items) {
      items.push(await insertItem(tx, acquisition.id, item));
    }
    return { acquisition, items };
  });
};

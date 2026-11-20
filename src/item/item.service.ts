import { db } from '../prisma/db.js';
import { Item } from './item.schema.js';

const asMoney = (value: string): number => Number(value);

export const listItems = async (): Promise<Item[]> => {
  const itemTable = db.sql.public.item;
  const plan = db.raw.sql`
    SELECT id, acquisition_id, name, sku, condition::text AS condition, allocated_cost, status::text AS status, created_at, updated_at
    FROM item
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

  const rows = await db.query(plan);
  return rows.map((row) =>
    Item.parse({
      ...row,
      allocated_cost: asMoney(row.allocated_cost)
    })
  );
};

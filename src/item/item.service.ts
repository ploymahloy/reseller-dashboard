import { db } from '../prisma/db.js';
import { Item } from './item.schema.js';

const asMoney = (value: string): number => Number(value);

export const listItems = async (): Promise<Item[]> => {
  const rows = await db.orm.public.Item.all();
  return rows.map((row) =>
    Item.parse({
      ...row,
      allocated_cost: asMoney(row.allocated_cost)
    })
  );
};

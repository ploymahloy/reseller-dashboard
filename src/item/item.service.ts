import { db } from '../prisma/db.js';
import { type Item, ItemSchema, type ItemFilter } from './item.schema.js';

const asMoney = (value: string): number => Number(value);

export const listItems = async (filter: ItemFilter = {}): Promise<Item[]> => {
  let query = db.orm.public.Item;

  const id = filter.id;
  if (id !== undefined) query = query.where((item) => item.id.eq(id));

  const acquisitionId = filter.acquisition_id;
  if (acquisitionId !== undefined) query = query.where((item) => item.acquisition_id.eq(acquisitionId));

  const name = filter.name;
  if (name !== undefined) query = query.where((item) => item.name.eq(name));

  const sku = filter.sku;
  if (sku !== undefined) query = query.where((item) => item.sku.like(`%${sku}%`));

  const condition = filter.condition;
  if (condition !== undefined) query = query.where((item) => item.condition.eq(condition));

  const allocatedCost = filter.allocated_cost;
  if (allocatedCost !== undefined) query = query.where((item) => item.allocated_cost.gte(allocatedCost.toFixed(2)));

  const status = filter.status;
  if (status !== undefined) query = query.where((item) => item.status.eq(status));

  const createdAt = filter.created_at;
  if (createdAt !== undefined) {
    const start = new Date(createdAt);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);
    query = query
      .where((item) => item.created_at.gte(start))
      .where((item) => item.created_at.lt(end));
  };

  const updatedAt = filter.updated_at;
  if (updatedAt !== undefined) {
    const start = new Date(updatedAt);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);
    query = query
      .where((item) => item.updated_at.gte(start))
      .where((item) => item.updated_at.lt(end));
  };

  const items = await query.all();
  return items.map((item) =>
    ItemSchema.parse({
      ...item,
      allocated_cost: asMoney(item.allocated_cost)
    })
  );
};

import { db } from '../prisma/db.js';

import {
  type Item,
  ItemQuantitySchema,
  type ItemQuantity,
  ItemSchema,
  type ItemListQuery,
  type ItemPage
} from './item.schema.js';
import { asMoney } from '../shared/utils.js';

const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;

const asItems = (rows: ReadonlyArray<{ allocated_cost: string }>): Item[] =>
  rows.map((item) =>
    ItemSchema.parse({
      ...item,
      allocated_cost: asMoney(item.allocated_cost)
    })
  );

const direction = <Result>(column: { asc(): Result; desc(): Result }, descending: boolean): Result =>
  descending ? column.desc() : column.asc();

const sortItems = (query: typeof db.orm.public.Item, sort: ItemListQuery['sort'], descending: boolean) => {
  switch (sort) {
    case 'allocated_cost':
      return query
        .orderBy((item) => direction(item.allocated_cost, descending))
        .orderBy((item) => direction(item.id, descending));
    case 'created_at':
      return query
        .orderBy((item) => direction(item.created_at, descending))
        .orderBy((item) => direction(item.id, descending));
    case undefined:
      return null;
  }
};

export const getItems = async (filter: ItemListQuery = {}): Promise<ItemPage> => {
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

  const sorted = sortItems(query, filter.sort, filter.order === 'desc');

  const paginated = filter.page !== undefined || filter.page_size !== undefined;
  if (!paginated) {
    const items = asItems(await (sorted ?? query).all());
    return { items, page: 1, page_size: items.length, total_items: items.length };
  }

  const page = Math.max(1, filter.page ?? 1);
  const pageSize = Math.min(Math.max(1, filter.page_size ?? DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);
  const counted = await query.aggregate((agg) => ({ total_items: agg.count() }));
  const pageQuery = sorted ?? query.orderBy((item) => item.id.asc());
  const rows = await pageQuery.offset((page - 1) * pageSize).limit(pageSize).all();

  return {
    items: asItems(rows),
    page,
    page_size: pageSize,
    total_items: counted.total_items
  };
};

export const getItemQuantities = async (): Promise<ItemQuantity[]> => {
  const rows = await db.orm.public.Item
    .groupBy('sku')
    .orderBy((item) => item.sku.asc())
    .aggregate((agg) => ({
      name: agg.min('name'), // Return the first name found for each sku
      quantity: agg.count()
    }));

  return rows.map((row) =>
    ItemQuantitySchema.parse({
      name: row.name,
      sku: row.sku,
      quantity: row.quantity
    })
  );
};
import { z } from 'zod';

export const ItemCondition = z.enum(['new', 'like_new', 'refurbished', 'used_good', 'used_fair', 'salvage']);

export type ItemCondition = z.infer<typeof ItemCondition>;

export const ItemStatus = z.enum([
  'purchased',
  'inspecting',
  'prep_required',
  'ready_to_list',
  'listed',
  'sold',
  'shipped',
  'completed',
  'returned',
  'unlisted',
  'scrapped'
]);

export type ItemStatus = z.infer<typeof ItemStatus>;

export const ItemSchema = z.object({
  id: z.number(),
  acquisition_id: z.number(),
  name: z.string().trim().min(1, 'Name cannot be empty or contain only whitespace'),
  sku: z.string().trim().min(1, 'Sku cannot be empty or contain only whitespace'),
  condition: ItemCondition,
  allocated_cost: z.number().nonnegative({ error: 'Allocated cost cannot be negative.' }),
  status: ItemStatus.default('purchased'),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Item = z.infer<typeof ItemSchema>;

export const CreateItemRequest = ItemSchema.omit({
  id: true,
  acquisition_id: true,
  created_at: true,
  updated_at: true
});

export type CreateItemRequest = z.infer<typeof CreateItemRequest>;

export const ItemFilterSchema = z.object({
  id: z.coerce.number().optional(),
  acquisition_id: z.coerce.number().optional(),
  name: z.string().trim().min(1).optional(),
  sku: z.string().trim().min(1).optional(),
  condition: ItemCondition.optional(),
  allocated_cost: z.coerce.number().nonnegative().optional(),
  status: ItemStatus.optional(),
  created_at: ItemSchema.shape.created_at.optional(),
  updated_at: ItemSchema.shape.updated_at.optional()
});

export type ItemFilter = z.infer<typeof ItemFilterSchema>;

export const ItemSortField = z.enum(['allocated_cost', 'created_at']);
export type ItemSortField = z.infer<typeof ItemSortField>;

export const ItemSortOrder = z.enum(['asc', 'desc']);
export type ItemSortOrder = z.infer<typeof ItemSortOrder>;

export const ItemListQuerySchema = ItemFilterSchema.extend({
  page: z.coerce.number().int().positive().optional(),
  page_size: z.coerce.number().int().positive().max(100).optional(),
  sort: ItemSortField.optional(),
  order: ItemSortOrder.optional()
});

export type ItemListQuery = z.infer<typeof ItemListQuerySchema>;

export type ItemPage = {
  items: Item[];
  page: number;
  page_size: number;
  total_items: number;
};

export const ItemQuantitySchema = z.object({
  name: z.string(),
  sku: z.string(),
  quantity: z.number().int().nonnegative()
});

export type ItemQuantity = z.infer<typeof ItemQuantitySchema>;
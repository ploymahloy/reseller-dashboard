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

export const Item = z.object({
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

export type Item = z.infer<typeof Item>;

export const CreateItemRequest = Item.omit({
  id: true,
  acquisition_id: true,
  created_at: true,
  updated_at: true
});

export type CreateItemRequest = z.infer<typeof CreateItemRequest>;

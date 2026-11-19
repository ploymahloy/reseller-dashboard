import { z } from 'zod';

// Rejects null, undefined, and empty strings before coercion
export const SafeCoercedDateSchema = z.preprocess((val) => (val === '' || val === null ? undefined : val), z.coerce.date());

export const JsonPrimitiveSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

export const ManifestRowSchema = z.record(z.string().min(1), JsonPrimitiveSchema.optional());
export const ManifestJsonbSchema = z.array(ManifestRowSchema).min(1);

export type ManifestRow = z.infer<typeof ManifestRowSchema>;
export type ManifestJsonb = z.infer<typeof ManifestJsonbSchema>;

export const SupplierName = z.string().trim().min(1, 'Supplier name cannot be blank.');

export const Supplier = z.object({
  name: SupplierName,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Supplier = z.infer<typeof Supplier>;

export const Acquisition = z.object({
  id: z.number(),
  supplier_name: SupplierName,
  purchase_date: SafeCoercedDateSchema,
  purchase_price: z.number().nonnegative({ error: 'Purchase price cannot be negative.' }),
  freight_cost: z.number().nonnegative({ error: 'Freight cost cannot be negative.' }),
  manifest: ManifestJsonbSchema.nullable(),
  notes: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Acquisition = z.infer<typeof Acquisition>;

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

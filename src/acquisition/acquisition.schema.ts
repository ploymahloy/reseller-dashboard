import { z } from 'zod';

import { CreateItemRequest } from '../item/item.schema.js';
import { JsonPrimitiveSchema, SafeCoercedDateSchema } from '../shared/schema.js';
import { SupplierName } from '../supplier/supplier.schema.js';

export const ManifestRowSchema = z.record(z.string().min(1), JsonPrimitiveSchema.optional());
export const ManifestJsonbSchema = z.array(ManifestRowSchema).min(1);

export type ManifestRow = z.infer<typeof ManifestRowSchema>;
export type ManifestJsonb = z.infer<typeof ManifestJsonbSchema>;

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

export const CreateAcquisitionRequest = Acquisition.omit({
  id: true,
  created_at: true,
  updated_at: true
}).extend({
  freight_cost: z.number().nonnegative({ error: 'Freight cost cannot be negative.' }).optional(),
  manifest: ManifestJsonbSchema.nullable().optional(),
  notes: z.string().nullable().optional(),
  items: z.array(CreateItemRequest).min(1)
});

export type CreateAcquisitionRequest = z.infer<typeof CreateAcquisitionRequest>;

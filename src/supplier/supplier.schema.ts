import { z } from 'zod';

export const SupplierName = z.string().trim().min(1, 'Supplier name cannot be blank.');

export const Supplier = z.object({
  name: SupplierName,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Supplier = z.infer<typeof Supplier>;

import { db, type Tx } from '../prisma/db.js';
import type { CreateSupplierRequest, Supplier } from './supplier.schema.js';

const supplierNotFoundMessage = 'Supplier does not exist.';

const escapeIlike = (value: string) => value.replace(/[\\%_]/g, (char) => `\\${char}`);

export const isSupplierNotFoundError = (error: unknown): error is Error =>
  error instanceof Error && error.message === supplierNotFoundMessage;

export const listSupplierNames = async (): Promise<string[]> => {
  const rows = await db.orm.public.Supplier.select('name').all();
  return rows.map((row) => row.name);
};

export const getSupplierName = async (tx: Tx, requestedName: string): Promise<string> => {
  const found = await tx.orm.public.Supplier
    .select('name')
    .where((supplier) => supplier.name.ilike(escapeIlike(requestedName)))
    .first();
  if (found) return found.name;

  throw new Error(supplierNotFoundMessage);
};

const insertSupplier = async (tx: Tx, body: CreateSupplierRequest): Promise<Supplier> => {
  return tx.orm.public.Supplier.create({ name: body.name });
};

export const createSupplier = async (body: CreateSupplierRequest): Promise<Supplier> => {
  return db.transaction(async (tx) => insertSupplier(tx, body));
};

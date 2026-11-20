import { db, type Tx } from '../prisma/db.js';
import type { CreateSupplierRequest, Supplier } from './supplier.schema.js';

export const listSupplierNames = async (): Promise<string[]> => {
  const supplierTable = db.sql.public.supplier;
  const supplierNamesQuery = db.raw.sql`
    SELECT name FROM supplier
  `
    .returnsRow({
      name: supplierTable.columns.name
    })
    .build();

  const rows = await db.query(supplierNamesQuery);
  return rows.map((row) => row.name);
}

const insertSupplier = async (tx: Tx, body: CreateSupplierRequest): Promise<Supplier> => {
  const supplier = tx.sql.public.supplier;
  const plan = tx.raw.sql`
    INSERT INTO supplier (name)
    VALUES (${body.name})
    RETURNING name, created_at, updated_at
  `
    .returnsRow({
      name: supplier.columns.name,
      created_at: supplier.columns.created_at,
      updated_at: supplier.columns.updated_at
    })
    .build();

  const [row] = await tx.query(plan);
  if (!row) throw new Error('Supplier insert returned no row.');

  return row;
};

export const createSupplier = async (body: CreateSupplierRequest): Promise<Supplier> => {
  return db.transaction(async (tx) => insertSupplier(tx, body));
};

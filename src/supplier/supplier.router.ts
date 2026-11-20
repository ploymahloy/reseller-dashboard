import { SqlQueryError } from '@prisma/orm-family-sql/errors';
import { Router, type Request, type Response } from 'express';
import { CreateSupplierRequest } from './supplier.schema.js';
import { createSupplier, listSupplierNames } from './supplier.service.js';

export const supplierRouter = Router();

supplierRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const supplierNames = await listSupplierNames();
    res.status(200).json(supplierNames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to list supplier names.' });
  }
});

supplierRouter.post('/', async (req: Request, res: Response) => {
  const parsed = CreateSupplierRequest.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request', issues: parsed.error.issues });
    return;
  }

  try {
    const created = await createSupplier(parsed.data);
    res.status(201).json(created);
  } catch (error) {
    if (!SqlQueryError.is(error)) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create supplier.' });
      return;
    }

    if (error.sqlState === '23505') {
      res.status(409).json({ error: 'Supplier name already exists.' });
      return;
    }

    if (error.sqlState === '23514') {
      res.status(400).json({ error: 'Supplier name violates a database constraint.' });
      return;
    }

    console.error(error);
    res.status(500).json({ error: 'Failed to create supplier.' });
  }
});

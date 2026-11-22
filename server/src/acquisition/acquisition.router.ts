import { SqlQueryError } from '@prisma/orm-family-sql/errors';
import { Router, type Request, type Response } from 'express';

import { isSupplierNotFoundError } from '../supplier/supplier.service.js';
import { CreateAcquisitionRequest } from './acquisition.schema.js';
import { createAcquisition } from './acquisition.service.js';

export const acquisitionRouter = Router();

acquisitionRouter.post('/', async (req: Request, res: Response) => {
  const parsed = CreateAcquisitionRequest.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request', issues: parsed.error.issues });
    return;
  }

  try {
    const created = await createAcquisition(parsed.data);
    res.status(201).json(created);
  } catch (error) {
    if (isSupplierNotFoundError(error)) {
      res.status(404).json({ error: 'Supplier does not exist.' });
      return;
    }

    if (SqlQueryError.is(error)) {
      if (error.sqlState === '23503') {
        res.status(404).json({ error: 'Supplier does not exist.' });
        return;
      }
      if (error.sqlState === '23505') {
        res.status(409).json({ error: 'Acquisition already exists.' });
        return;
      }
      if (error.sqlState === '23514') {
        res.status(400).json({ error: 'Acquisition violates a database constraint.' });
        return;
      }
    }

    console.error(error);
    res.status(500).json({ error: 'Failed to create acquisition.' });
  }
});

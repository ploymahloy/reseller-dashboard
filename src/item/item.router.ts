import { Router, type Request, type Response } from 'express';
import { listItems } from './item.service.js';

export const itemRouter = Router();

itemRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const items = await listItems();
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to list items.' });
  }
});

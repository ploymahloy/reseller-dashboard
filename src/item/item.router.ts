import { Router, type Request, type Response } from 'express';
import { listItems } from './item.service.js';
import { ItemFilterSchema } from './item.schema.js';

export const itemRouter = Router();

itemRouter.get('/', async (req: Request, res: Response) => {
  try {
    const filter = ItemFilterSchema.parse(req.query);
    const items = await listItems(filter);
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to return item list.' });
  }
});

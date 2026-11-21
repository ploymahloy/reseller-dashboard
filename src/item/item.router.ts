import { Router, type Request, type Response } from 'express';
import { getItems } from './item.service.js';
import { ItemListQuerySchema } from './item.schema.js';

export const itemRouter = Router();

itemRouter.get('/', async (req: Request, res: Response) => {
  try {
    const filter = ItemListQuerySchema.parse(req.query);
    const page = await getItems(filter);
    res.status(200).json(page);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to return item list.' });
  }
});

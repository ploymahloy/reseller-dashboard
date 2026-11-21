import { Router, type Request, type Response } from 'express';
import { getItems, getItemQuantities, updateItem } from './item.service.js';
import { ItemListQuerySchema, ItemQuantityQuerySchema, UpdateItemRequestSchema } from './item.schema.js';

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

itemRouter.get('/quantities', async (req: Request, res: Response) => {
  try {
    const query = ItemQuantityQuerySchema.parse(req.query);
    const quantities = await getItemQuantities(query.sortOnColumn, query.order);
    res.status(200).json(quantities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to return item quantities.' });
  }
});

itemRouter.patch('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (typeof id !== 'string' || id.trim() === '') {
      return res.status(400).json({ error: 'Item ID is required.' });
    }

    const itemId = parseInt(id);
    if (Number.isNaN(itemId)) {
      return res.status(400).json({ error: 'Item ID is not a valid number.' });
    }

    const data = UpdateItemRequestSchema.parse({
      ...(typeof req.body === 'object' && req.body !== null ? req.body : {}),
      ...req.query
    });
    const item = await updateItem(itemId, data);
    res.status(200).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update item.' });
  }
});

import express from 'express';
import { acquisitionRouter } from './acquisition/acquisition.router.js';
import { itemRouter } from './item/item.router.js';
import { supplierRouter } from './supplier/supplier.router.js';

export function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/acquisition', acquisitionRouter);
  app.use('/items', itemRouter);
  app.use('/supplier', supplierRouter);
  return app;
}

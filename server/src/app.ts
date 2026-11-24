import cors from 'cors';
import express from 'express';
import { acquisitionRouter } from './acquisition/acquisition.router.js';
import { itemRouter } from './item/item.router.js';
import { supplierRouter } from './supplier/supplier.router.js';

export const createApp = () => {
  const app = express();
  // TODO: Add proper CORS configuration
  app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
  app.use(express.json());
  app.use('/acquisition', acquisitionRouter);
  app.use('/items', itemRouter);
  app.use('/supplier', supplierRouter);
  return app;
};

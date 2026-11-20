import express from 'express';
import { acquisitionRouter } from './acquisition/acquisition.router.js';
import { supplierRouter } from './supplier/supplier.router.js';

export function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/acquisition', acquisitionRouter);
  app.use('/supplier', supplierRouter);
  return app;
}

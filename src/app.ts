import express from 'express';
import { acquisitionRouter } from './acquisition/acquisition.router.js';

export function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/acquisition', acquisitionRouter);
  return app;
}

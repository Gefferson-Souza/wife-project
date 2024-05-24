import mongoose from 'mongoose';
import config from './src/utils/config.js';
import {
  morganLogger,
  unkownEndpoint,
  errorHandler,
  tokenExtractor,
} from './src/utils/middleware.js';
import express from 'express';
import ProdutoRouter from './src/routes/ProdutoRouter.js';
import cors from 'cors';

const app = express();

mongoose.set('strictQuery', false);

mongoose
  .connect(config.uri)
  .then(() => {
    console.log('Conectado ao mongodb');
  })
  .catch((error) => {
    console.error(error.message);
  });
// Para JSON payloads
app.use(express.json({ limit: '50mb' }));

// Para FormData payloads (uploads de arquivos)
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(express.json());
app.use(morganLogger);
app.use(tokenExtractor);
app.use('/api/products', ProdutoRouter);
app.use(unkownEndpoint);
app.use(errorHandler);

export default app;
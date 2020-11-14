/* eslint-disable no-console */
import express from 'express';
import logger from 'morgan';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes';
import { respondWithWarning } from './helper/responseHandler';
import { DATABASE_URL } from './config/constants';

dotenv.config();

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}).then(() => console.log('Database connection established'));

const whitelist = ['http://localhost:3000', 'http://localhost:4000'];
const corsOptions = {
  origin(origin, callback) {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(' Not allowed by CORS'));
    }
  },
  credentials: true,
};

const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(apiRouter);

app.use('*', (req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

if (process.env.NODE_ENV === 'development') {
  app.use((error, req, res, next) => {
    respondWithWarning(res, error.status || 500, error.message, error);
  });
} else {
  app.use((error, req, res, next) => {
    respondWithWarning(res, error.status || 500, error.message);
  });
}
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server initialised and listening on port ${PORT}`));

export default app;

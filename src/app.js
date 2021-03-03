import express from 'express';
import logger from 'morgan';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes';
import { respondWithWarning } from './helper/responseHandler';
import { DATABASE_URL, ATLAS_URL } from './config/constants';

dotenv.config();

const DATA_CONNECTION = process.env.NODE_ENV !== 'production' ? DATABASE_URL : ATLAS_URL;

mongoose
  .connect(DATA_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log(`Connection established with ${process.env.NODE_ENV} database`));

const whitelist = [
  'http://localhost:3000',
  'http://localhost:4000',
  'https://thirsty-kirch-3242e6.netlify.app',
  'https://youtube-clone-ui.vercel.app',
  'https://602bf79bdd16b900088c7ffd--thirsty-kirch-3242e6.netlify.app',
];
const corsOptions = {
  origin(origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`${origin} Not allowed by CORS`));
    }
  },
  credentials: true,
};

const app = express();

app.use('/uploads', express.static('./uploads'));

app.options('*', cors(corsOptions));
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

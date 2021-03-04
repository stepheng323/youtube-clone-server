import dotenv from 'dotenv';

dotenv.config();

const {
  AWS_SECRET_ACCESS_KEY,
  AWS_KEY_ID,
  DATABASE_URL,
  PORT,
  AWS_BASE_URL,
  ATLAS_URL,
  NODE_ENV
} = process.env;

export {
  AWS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  DATABASE_URL,
  PORT,
  AWS_BASE_URL,
  ATLAS_URL,
  NODE_ENV
};

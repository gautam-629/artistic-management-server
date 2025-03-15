import { config } from 'dotenv';
import path from 'path';
config({
  path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || 'dev'}`),
});
const {
  PORT,
  NODE_ENV,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  JWT_SECRET,
  JWT_EXPIRES_IN,
} = process.env;

export const Config = {
  PORT,
  NODE_ENV,
  DB_USER,
  DB_HOST,
  DB_NAME,
  JWT_EXPIRES_IN,
  JWT_SECRET,
  DB_PASSWORD,
  DB_PORT,
};

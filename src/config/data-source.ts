import { Pool } from 'pg';
import { Config } from '.';
import logger from './logger';

const pool = new Pool({
  user: Config.DB_USER,
  host: Config.DB_HOST,
  database: Config.DB_NAME,
  password: Config.DB_PASSWORD,
  port: parseInt(Config.DB_PORT!),
  ssl: {
    rejectUnauthorized: false, // Ensure SSL certificate is not rejected.
  },
  connectionString: `postgresql://${Config.DB_USER}:${Config.DB_PASSWORD}@${Config.DB_HOST}:${Config.DB_PORT}/${Config.DB_NAME}?sslmode=require`,
});

export const testDbConnection = async () => {
  try {
    const client = await pool.connect();
    logger.info('Database Connected Successfully');
    client.release();
  } catch (error) {
    logger.error('Database connection failed:', error);
  }
};

export default pool;

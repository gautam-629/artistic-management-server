import { Pool } from 'pg';
import { Config } from '.';
import logger from './logger';

const pool = new Pool({
  user: Config.DB_USER,
  host: Config.DB_HOST,
  database: Config.DB_NAME,
  password: Config.DB_PASSWORD,
  port: parseInt(Config.DB_PORT!),
  ssl: { rejectUnauthorized: false },
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

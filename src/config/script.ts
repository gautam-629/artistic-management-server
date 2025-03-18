import pool from './data-source';
import logger from './logger';

export const createTables = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          first_name VARCHAR(255),
          last_name VARCHAR(255),
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(500),
          phone VARCHAR(20),
          dob TIMESTAMP,
          gender CHARACTER(1),
          address VARCHAR(255),
          role VARCHAR(50) DEFAULT 'artist',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
  
        CREATE TABLE IF NOT EXISTS artists (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          first_release_year INTEGER,    
          user_id INT REFERENCES users(id) ON DELETE CASCADE,  
          no_of_albums_released INTEGER,   
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
  
        CREATE TABLE IF NOT EXISTS musics (
          id SERIAL PRIMARY KEY,
          artist_id INT REFERENCES artists(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          album_name VARCHAR(255),
          genre VARCHAR(10) CHECK (genre IN ('rnb', 'country', 'classic', 'rock', 'jazz')),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
    logger.info('Table Created Successfully');
  } catch (error) {
    logger.error('Table Creation Fail:', error);
  }
};

createTables();

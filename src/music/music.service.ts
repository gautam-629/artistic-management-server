import { ArtistService } from '../artise/artise.service';
import { CustomError } from '../common/util/ErrorHandler';
import pool from '../config/data-source';
import { IMusic } from './music';

export class MusicService {
  constructor(private artiseService: ArtistService) {}

  async creatMusic(music: IMusic) {
    const { title, album_name, genre, artist_id } = music;

    const artise = await this.artiseService.getSingleArtistByUserId(String(artist_id));

    const query = `
        INSERT INTO musics (title, album_name, genre, artist_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;

    const result = await pool.query(query, [title, album_name, genre, artise.id]);
    return result.rows[0];
  }

  async getmusicDetailsByid(id: string) {
    const query = `
        SELECT 
        m.*, 
        u.first_name || ' ' || u.last_name AS artist_name
        FROM musics m
        JOIN artists a ON m.artist_id = a.id
        JOIN users u ON a.user_id = u.id
         WHERE m.id = $1
        `;

    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async getMusics(page: number, limit: number) {
    const offset = (page - 1) * limit;

    const query = `
          SELECT 
            m.*, 
            u.first_name || ' ' || u.last_name AS artist_name
          FROM musics m
          JOIN artists a ON m.artist_id = a.id
          JOIN users u ON a.user_id = u.id
          ORDER BY m.created_at DESC
          LIMIT $1 OFFSET $2
        `;

    const countQuery = 'SELECT COUNT(*) FROM musics';

    const [music, count] = await Promise.all([
      pool.query(query, [limit, offset]),
      pool.query(countQuery),
    ]);
    return {
      data: music.rows,
      pagination: {
        page,
        limit,
        total: Number(count.rows[0].count),
        totalPages: Math.ceil(count.rows[0].count / limit),
      },
    };
  }

  async deleteMusic(id: string, currentUser_id: string) {
    // verify the artist own the song
    const music = await this.getSingle(id);
    const artise = await this.artiseService.getSingleArtistByUserId(String(currentUser_id));
    if (!music) {
      throw new CustomError(404, 'Music not found!');
    }

    if (music.artist_id !== artise.id) {
      throw new CustomError(403, 'Not allowed to delete!');
    }

    const query = `DELETE FROM musics WHERE id= $1 RETURNING  id`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async getSingle(id: string) {
    const query = `SELECT * FROM musics WHERE id = $1`;

    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async updateMusic(id: string, musicData: IMusic, currentUser_id: string) {
    // Verify the artist owns the song
    const artise = await this.artiseService.getSingleArtistByUserId(String(currentUser_id));
    const music = await this.getSingle(id);

    if (!music) {
      throw new CustomError(404, 'Music not found!');
    }

    if (music.artist_id !== artise.id) {
      throw new CustomError(403, 'Not allowed to update!');
    }

    const { title, album_name, genre } = musicData;

    const query = `
            UPDATE musics 
            SET 
                title = COALESCE($1, title),
                album_name = COALESCE($2, album_name),
                genre = COALESCE($3, genre),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $4 AND artist_id = $5
            RETURNING *;
        `;

    const result = await pool.query(query, [title, album_name, genre, id, artise.id]);

    return result.rows[0] || null;
  }

  async getSongsByArtist(userId: string) {
    const query = `SELECT 
                m.id AS song_id,
                m.title AS song_title,
                m.album_name,
                m.genre,
                m.created_at AS song_created_at,
                u.id AS user_id,
                u.first_name,
                u.last_name,
                u.email
            FROM musics m
            INNER JOIN artists a ON m.artist_id = a.id
            INNER JOIN users u ON a.user_id = u.id
            WHERE u.id = $1`;

    const result = await pool.query(query, [userId]);
    return result.rows || [];
  }
}

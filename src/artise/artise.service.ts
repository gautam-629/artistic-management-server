import pool from '../config/data-source';
import { IArtist } from './artist';

export class ArtistService {
  async createArtise(artist: IArtist) {
    const { name, dob, gender, address, first_release_year, no_of_albums_released } = artist;
    const query = `
        INSERT INTO artists (name, dob, gender, address, first_release_year, no_of_albums_released)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;

    const result = await pool.query(query, [
      name,
      dob,
      gender,
      address,
      first_release_year,
      no_of_albums_released,
    ]);

    return result.rows[0];
  }

  async getArtiseById(id: string) {
    const query = `SELECT * FROM artists WHERE id=$1`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async getArtists(page: number, limit: number) {
    const offset = (page - 1) * limit;

    const query = `SELECT * from artists ORDER BY created_at DESC LIMIT $1 OFFSET $2`;

    const countQuery = `SELECT COUNT(*) from artists`;

    const [users, count] = await Promise.all([
      pool.query(query, [limit, offset]),
      pool.query(countQuery),
    ]);

    return {
      data: users.rows,
      pagination: {
        page,
        limit,
        total: Number(count.rows[0].count),
        totalPages: Math.ceil(count.rows[0].count / limit),
      },
    };
  }

  async deleteArtists(id: string) {
    const query = `DELETE FROM artists WHERE id= $1 RETURNING  id`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async updateArtists(id: string, ArtistsData: IArtist) {
    const { name, dob, gender, address, first_release_year, no_of_albums_released } = ArtistsData;
    const query = `
        UPDATE artists 
        SET 
          name = COALESCE($1, name),
          dob = COALESCE($2, dob),
          gender = COALESCE($3, gender),
          address = COALESCE($4, address),
          first_release_year = COALESCE($5, first_release_year),
          no_of_albums_released = COALESCE($6, no_of_albums_released),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING *
      `;

    const result = await pool.query(query, [
      name,
      dob,
      gender,
      address,
      first_release_year,
      no_of_albums_released,
      id,
    ]);
    return result.rows[0] || null;
  }
}

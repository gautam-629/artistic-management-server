import { Gender, Role } from '../common/enum';
import pool from '../config/data-source';
import { IUser } from '../users/users';
import { Userservice } from '../users/users.service';
import { IArtist } from './artist';

export class ArtistService {
  constructor(private userService: Userservice) {}

  async createArtise(artist: IArtist) {
    const { first_name, last_name, email, phone, dob, gender, address, password } = artist;

    const userData: IUser = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      phone: phone,
      dob: dob,
      gender: gender,
      address: address,
      role: Role.Artist,
      password: password,
    };

    const newUser = await this.userService.createUser(userData);

    const { first_release_year, no_of_albums_released } = artist;
    const query = `
        INSERT INTO artists (user_id,first_release_year, no_of_albums_released)
        VALUES ($1, $2, $3)
        RETURNING *
      `;

    const result = await pool.query(query, [newUser.id, first_release_year, no_of_albums_released]);

    return result.rows[0];
  }

  async getArtiseById(id: string) {
    const query = `
    SELECT 
      a.*,
      u.first_name,
      u.last_name,
      u.email,
      u.phone,
      u.gender,
      u.role,
      u.dob,
      u.address
    FROM 
      artists a
    JOIN 
      users u ON a.user_id = u.id
    WHERE 
      a.id = $1 AND
      u.role = 'artist'
  `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async getArtists(page: number, limit: number) {
    const offset = (page - 1) * limit;

    const query = `
  SELECT 
    a.*,
    u.first_name,
    u.last_name,
    u.email,
    u.phone,
    u.gender,
    u.role
  FROM 
    artists a
  JOIN 
    users u ON a.user_id = u.id
  WHERE
    u.role = 'artist'
  ORDER BY 
    a.created_at DESC
  LIMIT $1 OFFSET $2
`;

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
    const { first_name, last_name, email, phone, dob, gender, address, password } = ArtistsData;

    const userData: IUser = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      phone: phone,
      dob: dob,
      gender: gender,
      address: address,
      role: Role.Artist,
      password: password,
    };
    this.userService.updateUser(id, userData);

    const { first_release_year, no_of_albums_released } = ArtistsData;
    const query = `
        UPDATE artists 
        SET 
          user_id = COALESCE($1,user_id ),
          first_release_year = COALESCE($2, first_release_year),
          no_of_albums_released = COALESCE($3, no_of_albums_released),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING *
      `;

    const result = await pool.query(query, [id, first_release_year, no_of_albums_released, id]);
    return result.rows[0] || null;
  }
}

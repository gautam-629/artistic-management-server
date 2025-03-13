import pool from "../config/data-source";
import { IUser } from "./users";
import bcrypt from 'bcryptjs';
export class Userservice{
   async createUser(user:IUser){
        const { first_name, last_name, email, phone, dob, gender, address, role ,password}=user;

        const hashPassword= await bcrypt.hash(password,10)

        const query = `
        INSERT INTO users (first_name, last_name, email, phone, dob, gender, address, role,password , created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9 ,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *;
      `;
  
      const result = await pool.query(query, [first_name, last_name, email, phone, dob, gender, address, role,hashPassword]);
      return result.rows[0];
    }

 
}
import { CustomError } from "../common/util/ErrorHandler";
import pool from "../config/data-source";
import { IUser } from "./users";
import bcrypt from 'bcryptjs';
export class Userservice{
   async createUser(user:IUser){
        const { first_name, last_name, email, phone, dob, gender, address, role ,password}=user;

        const isUserExit= await this.getUserByEmail(user.email)

        if(isUserExit){
            throw new CustomError(400,"Email is already exists!")
        }

        const hashPassword= await bcrypt.hash(password,10)

        const query = `
        INSERT INTO users (first_name, last_name, email, phone, dob, gender, address, role,password , created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9 ,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *;
      `;
  
      const result = await pool.query(query, [first_name, last_name, email, phone, dob, gender, address, role,hashPassword]);
      return result.rows[0];
    }

   async getUserByEmail(email:string){
          const query=`SELECT * FROM users WHERE id=$1`
          const result = await pool.query(query,[email])
          return result.rows[0] || null;
    }
 
   async getUserUserById(id:string){
      const query=  `SELECT * FROM users WHERE id=$1`
      const result= await pool.query(query,[id])
      return result.rows[0] || null;
    }

}
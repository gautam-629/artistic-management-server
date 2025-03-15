import { Gender, Role } from '../common/enum';
import { IUser } from './users';

export class UserDTO {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dob: Date;
  gender: Gender;
  address: string;
  role: Role;
  constructor(
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    phone: string,
    dob: Date,
    gender: Gender,
    address: string,
    role: Role
  ) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.phone = phone;
    this.dob = dob;
    this.gender = gender;
    this.address = address;
    this.role = role;
  }

  static fromUser(user: IUser) {
    return new UserDTO(
      user.id as number,
      user.first_name,
      user.last_name,
      user.email,
      user.phone,
      user.dob,
      user.gender,
      user.address,
      user.role
    );
  }
  static fromUsers(users: any[]): UserDTO[] {
    return users.map((user) => this.fromUser(user));
  }
}

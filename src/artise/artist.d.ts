import { Gender } from '../common/enum';

export interface IArtist {
  id: number;
  user_id: string | number;
  first_release_year: number;
  no_of_albums_released: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  dob: Date;
  gender: Gender;
  address: string;
  role: Role;
}

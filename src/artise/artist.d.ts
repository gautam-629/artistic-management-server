import { Gender } from '../common/enum';

export interface IArtist {
  id: number;
  name: string;
  dob: Date | null;
  gender: Gender;
  address: string | null;
  first_release_year: number;
  no_of_albums_released: number;
  created_at: Date;
  updated_at: Date;
}

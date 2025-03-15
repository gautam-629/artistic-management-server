export type IMusic = {
  id: number;
  artist_id: number;
  title: string;
  album_name?: string | null;
  genre?: Genre;
};

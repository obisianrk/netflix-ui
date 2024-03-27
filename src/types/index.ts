export type Movie = {
  id: number,
  name: string,
  image: string,
  genres: string[]
};

export type Genre = {
  id: number,
  name: string
}

export interface initialStateInterface {
  movies: Movie[],
  genresLoaded: boolean,
  genres: Genre[],
}

export interface NetflixStoreInterface {
  netflix: {
    movies: Movie[],
    genres: Genre[],
    genresLoaded: boolean,
  }
}

export type RawMovieObject = {
  id: number,
  genre_ids: number[],
  backdrop_path?: string,
  original_name?: string,
  original_title: string, 
}

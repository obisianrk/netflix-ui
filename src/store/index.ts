import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { TMDB_API_KEY, TMDB_BASE_URL } from "../utils/constants";
import {
  Genre,
  Movie,
  NetflixStoreInterface,
  RawMovieObject,
  initialStateInterface,
} from "../types";

const initialState: initialStateInterface = {
  movies: [],
  genresLoaded: false,
  genres: [],
};

export const getGenres = createAsyncThunk("netflix/genres", async () => {
  const {
    data: { genres },
  } = await axios.get(
    `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`
  );
  return genres;
});

const createArrayFromRawData = (
  array: RawMovieObject[],
  moviesArray: Movie[],
  genres: Genre[]
) => {
  array.forEach((movie: RawMovieObject) => {
    const movieGenres: string[] = [];
    movie.genre_ids.forEach((genre: number) => {
      const name = genres.find(({ id }) => id === genre);
      if (name) movieGenres.push(name.name);
    });
    if (movie.backdrop_path)
      moviesArray.push({
        id: movie.id,
        name: movie?.original_name ? movie.original_name : movie.original_title,
        image: movie.backdrop_path,
        genres: movieGenres.slice(0, 3),
      });
  });
};

const getRawData = async (api: string, genres: Genre[], paging = false) => {
  const moviesArray: Movie[] = [];
  for (let i = 1; moviesArray.length < 60 && i < 10; i++) {
    const {
      data: { results },
    } = await axios.get(`${api}${paging ? `&page=${i}` : ""}`);
    createArrayFromRawData(results, moviesArray, genres);
  }

  return moviesArray;
};

export const fetchDataByGenre = createAsyncThunk(
  "netflix/genre",
  async ({ genre, type }: { genre: string; type: string }, thunkAPI) => {
    const {
      netflix: { genres },
    } = thunkAPI.getState() as NetflixStoreInterface;

    return getRawData(
      `https://api.themoviedb.org/3/discover/${type}?api_key=${TMDB_API_KEY}&with_genres=${genre}`,
      genres
    );
  }
);

export const fetchMovies = createAsyncThunk(
  "netflix/trending",
  async ({ type }: { type: string }, thunkAPI) => {
    const {
      netflix: { genres },
    } = thunkAPI.getState() as NetflixStoreInterface;

    return getRawData(
      `${TMDB_BASE_URL}/trending/${type}/week?api_key=${TMDB_API_KEY}`,
      genres,
      true
    );
  }
);

export const getUsersLikedMovies = createAsyncThunk(
  "netflix/getLiked",
  async (email: string) => {
    const {
      data: { movies },
    } = await axios.get(`http://localhost:5000/api/user/liked/${email}`);
    return movies;
  }
);

export const removeMovieFromLiked = createAsyncThunk(
  "netflix/deleteLiked",
  async ({ movieId, email }: { movieId: number; email: string }) => {
    const {
      data: { movies },
    } = await axios.put("http://localhost:5000/api/user/remove", {
      email,
      movieId,
    });
    return movies;
  }
);

const NetflixSlice = createSlice({
  name: "Netflix",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getGenres.fulfilled, (state, action) => {
      state.genres = action.payload;
      state.genresLoaded = true;
    });
    builder.addCase(fetchMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(fetchDataByGenre.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(getUsersLikedMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(removeMovieFromLiked.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
  },
});

export const store = configureStore({
  reducer: {
    netflix: NetflixSlice.reducer,
  },
});

// export const { setGenres, setMovies } = NetflixSlice.actions;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import MoviePage from "./pages/Movies";
import Netflix from "./pages/Netflix";
import Signup from "./pages/Signup";
import Player from "./pages/Player";
import TVShows from "./pages/TVShows";
import UserLikedMovies from "./pages/UserLikedMovies";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/player" element={<Player />} />
        <Route path="/tv" element={<TVShows />} />
        <Route path="/movies" element={<MoviePage />} />
        <Route path="/new" element={<Player />} />
        <Route path="/mylist" element={<UserLikedMovies />} />
        <Route path="/" element={<Netflix />} />
      </Routes>
    </BrowserRouter>
  );
}
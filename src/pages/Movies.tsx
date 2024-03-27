import { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import { useNavigate } from "react-router-dom";
import { fetchMovies, getGenres } from "../store";
import SelectGenre from "../components/SelectGenre";
import Slider from "../components/Slider";
import NotAvailable from "../components/NotAvailable";
import { useAppDispatch, useAppSelector } from "../store/hooks";

function MoviePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const movies = useAppSelector((state) => state.netflix.movies);
  const genres = useAppSelector((state) => state.netflix.genres);
  const genresLoaded = useAppSelector((state) => state.netflix.genresLoaded);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getGenres());
  }, [dispatch]);

  useEffect(() => {
    if (genresLoaded) {
      dispatch(fetchMovies({ type: "movie" }));
    }
  }, [genresLoaded, dispatch]);

  const [user, setUser] = useState("");

  onAuthStateChanged(firebaseAuth, (currentUser) => {
    if (currentUser) setUser(currentUser.uid);
    else {
      navigate("/login");
      console.log(`User id: ${user} did not exist`);
    }
  });

  window.onscroll = () => {
    setIsScrolled(window.scrollY === 0 ? false : true);
    return () => (window.onscroll = null);
  };

  return (
    <Container>
      <div className="navbar">
        <Navbar isScrolled={isScrolled} />
      </div>
      <div className="data">
        <SelectGenre genres={genres} type="movie" />
        {movies? <Slider movies={movies} /> : <NotAvailable />}
      </div>
    </Container>
  );
}

const Container = styled.div`
  .data {
    margin-top: 8rem;
    .not-available {
      text-align: center;
      color: white;
      margin-top: 4rem;
    }
  }
`;
export default MoviePage;

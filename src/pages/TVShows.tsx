import { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import { useNavigate } from "react-router-dom";
import { fetchMovies, getGenres } from "../store";
import SelectGenre from "../components/SelectGenre";
import Slider from "../components/Slider";
import { useAppDispatch, useAppSelector } from "../store/hooks";

function TVShows() {
  const [isScrolled, setIsScrolled] = useState(false);
  const movies = useAppSelector((state) => state.netflix.movies);
  const genres = useAppSelector((state) => state.netflix.genres);
  const genresLoaded = useAppSelector((state) => state.netflix.genresLoaded);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!genres.length) dispatch(getGenres());
  }, [dispatch, genres]);

  useEffect(() => {
    if (genresLoaded) {
      dispatch(fetchMovies({ type: "tv" }));
    }
  }, [genresLoaded, dispatch]);

  const [user, setUser] = useState("");

  onAuthStateChanged(firebaseAuth, (currentUser) => {
    if (currentUser) {
      setUser(currentUser.uid);
    } else {
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
      <Navbar isScrolled={isScrolled} />
      <div className="data">
        <SelectGenre genres={genres} type="tv" />
        {movies? (
          <>
            <Slider movies={movies} />
          </>
        ) : (
          <h1 className="not-available">
            No TV Shows available for the selected genre. Please select a
            different genre.
          </h1>
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  .data {
    margin-top: 8rem;
    .not-available {
      text-align: center;
      margin-top: 4rem;
    }
  }
`;
export default TVShows;

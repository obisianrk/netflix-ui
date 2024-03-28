import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseAuth } from "../utils/firebase-config";
import Card from "../components/Card";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import { getUsersLikedMovies } from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export default function UserListedMovies() {
  const movies = useAppSelector((state) => state.netflix.movies);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  onAuthStateChanged(firebaseAuth, (currentUser) => {
    if (currentUser) setEmail(currentUser.email);
    else navigate("/login");
  });

  useEffect(() => {
    if (email) {
      dispatch(getUsersLikedMovies(email));
    }
  }, [email, dispatch]);

  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll = null);
  };

  return (
    <Container>
      <Navbar isScrolled={isScrolled} />
      <div className="flex content column">
        <h1>My List</h1>
        <div className="flex list grid">
          {movies ? (
            movies.map((movie) => {
              return <Card movieData={movie} key={movie.id} isLiked={true} />;
            })
          ) : (
            <h2>List is Empty</h2>
          )}
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  .content {
    margin: 2.3rem;
    margin-top: 8rem;
    gap: 3rem;
    h1 {
      margin-left: 3rem;
    }
    .grid {
      margin-left: 3rem;
      flex-wrap: wrap;
      gap: 1rem;
      align-item: center;
    }
  }
`;

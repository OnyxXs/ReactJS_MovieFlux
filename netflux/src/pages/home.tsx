import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { database } from "../config/firebaseConfig";
import { Link } from "react-router-dom";
import "./home.css";
import MovieModal from "./MovieModal";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  overview: string;
}

function HomeScreen() {
  const history = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [sortBy, setSortBy] = useState<string>("title");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const apiKey = "322e602f97c88b604f6b06f734d87c9c";
  const accessToken = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMjJlNjAyZjk3Yzg4YjYwNGY2YjA2ZjczNGQ4N2M5YyIsInN1YiI6IjY1MzhkMDU2OWMyNGZjMDEwM2UwZjdmYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KXuBpgR7ruBWM64tPEGeSq1OLbGzonlQmnYqVhk3LJ0";

  const mapCategoryToGenreID = (category: string) => {
    const categoryMap: { [key: string]: number } = {
      "Horror": 27,
      "Romance": 10749,
      "Science Fiction": 878,
      "Action": 28,
    };
    return categoryMap[category];
  };

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.results);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [apiKey, accessToken]);

  const handleClick = () => {
    signOut(database)
      .then(() => {
        history("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const categories = ["", "Horror", "Romance", "Science Fiction", "Action"];

  const sortedMovies = [...movies];
  sortedMovies.sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "year") {
      return (
        parseInt(b.release_date.substring(0, 4)) -
        parseInt(a.release_date.substring(0, 4))
      );
    } else if (sortBy === "director") {
      // Vous pouvez implémenter la logique pour trier par réalisateur ici
    } else if (sortBy === "rating") {
      return b.vote_average - a.vote_average;
    } else if (sortBy === "category") {
      if (selectedCategory) {
        return a.genre_ids.includes(mapCategoryToGenreID(selectedCategory))
          ? -1
          : 1;
      }
    }
    return 0;
  });

  return (
    <div>
      <h1 className="header">Home</h1>
      <button onClick={handleClick} className="button-sign-out">
        Sign Out
      </button>

      <h2 className="header">Movie List</h2>
      <div className="sort-select">
        <label htmlFor="sort-select">Sort by:</label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={handleSortChange}
        >
          <option value="title">Title A-Z</option>
          <option value="year">Year</option>
          <option value="rating">Rating</option>
          <option value="category">Category</option>
        </select>
        {sortBy === "category" && (
          <div className="category-buttons">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-button${
                  selectedCategory === category ? " selected" : ""
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                {category || "All"}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="main-content">
        {sortedMovies.map((movie) => (
          <div
            key={movie.id}
            className="movie-item"
            onClick={() => setSelectedMovie(movie)}
          >
            <div className="movie-details">
              <img
                className="movie-poster"
                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                alt={movie.title}
              />
              <h3 className="movie-title">{movie.title}</h3>
              <p className="movie-rating">Rating: {movie.vote_average}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Affichez la fenêtre modale avec les détails du film/série sélectionné */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}

export default HomeScreen;
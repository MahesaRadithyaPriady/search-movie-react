import { useState, useEffect, useRef } from "react";
import { getMovies, searchMovie, searchTV } from "./api";
import React from "react";

function App() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const inputOption = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    getMovies().then((result) => {
      setPopularMovies(result);
      setIsLoading(false);
    });
  }, []);

  const search = async () => {
    const query = inputRef.current.value;
    const filter = inputOption.current.value;
    setInputQuery(query);

    if (query.length > 3) {
      setIsLoading(true);
      try {
        let searchResults;
        if (filter === "Movie" || !filter) {
          searchResults = await searchMovie(query);
        } else if (filter === "Tv") {
          searchResults = await searchTV(query);
        }
        setPopularMovies(searchResults.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const SkeletonLoading = () => {
    return (
      <div className="row">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="col-md-4 col-lg-4 col-sm-6 mb-4">
            <div className="card" style={{ width: "100%" }}>
              <div className="skeleton-img skeleton"></div>
              <div className="card-body">
                <div className="skeleton-title skeleton"></div>
                <div className="skeleton-text skeleton"></div>
                <div className="skeleton-text skeleton"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const PopularMovie = () => {
    if (isLoading) {
      return <SkeletonLoading />;
    }

    return (
      <div className="row">
        {popularMovies.map((movie, i) => (
          <div key={i} className="col-md-4 col-lg-4 col-sm-6 mb-4">
            <div className="card" style={{ width: "100%" }}>
              <div className="img-container" style={{ position: "relative" }}>
                <MovieImage movie={movie} />
              </div>
              <div className="card-body">
                <h5 className="card-title">
                  {movie.original_title
                    ? `${movie.original_title}`
                    : `${movie.name}`}
                </h5>
                <div className="card-text">
                  <p>
                    <span className="fw-bold fs-5">Details:</span>
                    {movie.overview.length > 150
                      ? `${movie.overview.substring(0, 150)}...`
                      : movie.overview}
                  </p>
                  <p>{movie.release_date}</p>
                </div>
                <a href="#" className="btn btn-primary">
                  More Info
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const MovieImage = ({ movie }) => {
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    const handleImageLoad = () => {
      setImageLoading(false);
    };

    const handleImageError = () => {
      setImageLoading(true); // Tetap tampilkan skeleton jika error
      setImageError(true);
    };

    return (
      <>
        {imageLoading && <div className="skeleton-img skeleton"></div>}
        {!imageError && (
          <img
            src={`${import.meta.env.VITE_APP_IMG}${
              movie.backdrop_path
            }?api_key=${import.meta.env.VITE_APP_API}`}
            className="card-img-top"
            alt={movie.title || "Image Not Available"}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{
              display: imageLoading ? "none" : "block",
            }}
          />
        )}
        {imageError && <div className="skeleton-img skeleton"></div>}
      </>
    );
  };

  return (
    <>
      <Header />
      <Content />
      <Footer />
    </>
  );

  function Header() {
    return (
      <nav className="navbar navbar-dark bg-primary p-4">
        <div className="container">
          <h1 className="navbar-brand fs-1 fw-bold">Movie DB React</h1>
          <p className="text-white">Search Your Favorite Movies</p>
        </div>
      </nav>
    );
  }

  function Content() {
    return (
      <div className="container mt-5">
        <h1 className="text-center fs-1 fw-bold mb-4">Go Search!</h1>
        <hr />
        <div className="input-group mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search Your Favorite Movies Or TV Series..."
            ref={inputRef}
          />
          <button className="btn btn-primary rounded" onClick={search}>
            Cari
          </button>
          <select
            className="ms-3 form-select"
            name="filter"
            ref={inputOption}
            id="filter"
          >
            <option value="">Filter Now</option>
            <option value="Movie">Movie</option>
            <option value="Tv">TV Series</option>
          </select>
        </div>
        <hr />
        <PopularMovie />
      </div>
    );
  }
}

function Footer() {
  return (
    <div className="footer text-center fs-5 fw-bold">
      <h5>&copy; Mahesa Radithya Priady 2024</h5>
    </div>
  );
}

export default App;

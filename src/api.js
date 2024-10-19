import axios from "axios";

export const getMovies = async () => {
  const movie = await axios.get(
    `${import.meta.env.VITE_APP_URL}/movie/popular?api_key=${
      import.meta.env.VITE_APP_API
    }`
  );
  return movie.data.results;
};

export const searchMovie = async (q) => {
  const search = await axios.get(
    `${import.meta.env.VITE_APP_URL}/search/movie?query=${q}&api_key=${
      import.meta.env.VITE_APP_API
    }`
  );

  return search.data;
};

export const searchTV = async (q) => {
  const search = await axios.get(
    `${import.meta.env.VITE_APP_URL}/search/tv?query=${q}&api_key=${
      import.meta.env.VITE_APP_API
    }`
  );

  return search.data;
};

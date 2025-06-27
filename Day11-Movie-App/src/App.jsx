import { useEffect, useState } from 'react';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function MovieApp() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [modalMovie, setModalMovie] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });

  const fetchTrendingMovies = async () => {
    setLoading(true);
    const res = await axios.get(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
    setMovies(res.data.results);
    setLoading(false);
  };

  const searchMovies = async () => {
    if (!search.trim()) return fetchTrendingMovies();
    setLoading(true);
    const res = await axios.get(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${search}`);
    setMovies(res.data.results);
    setLoading(false);
  };

  const fetchGenres = async () => {
    const res = await axios.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    setGenres(res.data.genres);
  };

  const filterByGenre = async (genreId) => {
    setSelectedGenre(genreId);
    setLoading(true);
    const res = await axios.get(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`);
    setMovies(res.data.results);
    setLoading(false);
  };

  const toggleFavorite = (movie) => {
    let updated = [...favorites];
    const exists = favorites.find(m => m.id === movie.id);
    if (exists) {
      updated = favorites.filter(m => m.id !== movie.id);
    } else {
      updated.push(movie);
    }
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  useEffect(() => {
    fetchTrendingMovies();
    fetchGenres();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center text-cyan-400 mb-6 drop-shadow">🎬 Movie App</h1>

      <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-md w-64 bg-white text-black outline-none"
        />
        <button
          onClick={searchMovies}
          className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600"
        >
          Search
        </button>
        <select
          value={selectedGenre}
          onChange={(e) => filterByGenre(e.target.value)}
          className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md"
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      {favorites.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl text-yellow-300 font-semibold mb-3">⭐ Your Favorites</h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {favorites.map((movie) => (
              <div key={movie.id} className="bg-zinc-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
                {movie.poster_path ? (
                  <img
                    src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-80 object-cover"
                  />
                ) : (
                  <div className="w-full h-80 bg-zinc-700 flex items-center justify-center">No Image</div>
                )}
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-1">{movie.title}</h2>
                  <p className="text-sm text-gray-400">⭐ {movie.vote_average} | 🗓️ {movie.release_date}</p>
                  <button
                    onClick={() => toggleFavorite(movie)}
                    className="mt-2 text-sm text-yellow-300"
                  >
                    ★ Remove Favorite
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center mt-12 animate-pulse text-xl text-gray-400">Loading movies...</div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {movies.map((movie) => (
            <div key={movie.id} className="bg-zinc-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition relative">
              <div onClick={() => setModalMovie(movie)} className="cursor-pointer">
                {movie.poster_path ? (
                  <img
                    src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-80 object-cover"
                  />
                ) : (
                  <div className="w-full h-80 bg-zinc-700 flex items-center justify-center">No Image</div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-1">{movie.title}</h2>
                <p className="text-sm text-gray-400">⭐ {movie.vote_average} | 🗓️ {movie.release_date}</p>
                <button
                  onClick={() => toggleFavorite(movie)}
                  className={`mt-2 text-sm ${favorites.find(m => m.id === movie.id) ? 'text-yellow-300' : 'text-gray-400'}`}
                >
                  {favorites.find(m => m.id === movie.id) ? '★ Remove Favorite' : '☆ Add to Favorite'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-zinc-800 text-white p-6 rounded-lg max-w-md w-full relative">
            <button
              onClick={() => setModalMovie(null)}
              className="absolute top-2 right-2 text-white text-xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">{modalMovie.title}</h2>
            {modalMovie.backdrop_path && (
              <img
                src={`${IMAGE_BASE_URL}${modalMovie.backdrop_path}`}
                alt={modalMovie.title}
                className="rounded mb-4"
              />
            )}
            <p className="text-sm text-gray-300 mb-2">📅 {modalMovie.release_date}</p>
            <p className="text-sm text-gray-300 mb-4">⭐ {modalMovie.vote_average}</p>
            <p className="text-gray-200 text-sm">{modalMovie.overview || 'No description available.'}</p>
          </div>
        </div>
      )}
    </div>
  );
}

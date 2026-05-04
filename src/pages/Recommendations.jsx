import React, { useEffect, useState } from 'react';
import { useMovieContext } from '../contexts/MovieContext';
import MovieCard from '../components/MovieCard';
import "../css/Favorites.css";

function Recommendations() {
  const { favorites } = useMovieContext();
  const [allRecommendations, setAllRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const FLASK_API = "https://filmyfind-backend.onrender.com";

  useEffect(() => {
    if (!favorites || favorites.length === 0) return;

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await Promise.all(
          favorites.map(async (movie) => {
            const response = await fetch(
              `${FLASK_API}/recommend?title=${encodeURIComponent(movie.title)}`
            );
            const data = await response.json();
            return {
              basedOn: movie.title,
              recommendations: response.ok ? data : []
            };
          })
        );
        setAllRecommendations(results);
      } catch (err) {
        setError("Could not connect to recommendation service");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [favorites]);

  if (!favorites || favorites.length === 0) {
    return (
      <div className="favorites-empty">
        <h2>No Recommendations Yet</h2>
        <p>Start adding movies to your favorites and we will recommend similar titles here.</p>
      </div>
    );
  }

  if (loading) return <p>Loading recommendations...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="favorites">
      <h2>Recommended For You</h2>
      {allRecommendations.map((section) => (
        section.recommendations.length > 0 && (
          <div key={section.basedOn} className="recommendation-section">
            <h3>Because you liked {section.basedOn}</h3>
            <div className="movies-grid">
              {section.recommendations.map((movie) => (
                <MovieCard movie={movie} key={movie.id} />
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
}

export default Recommendations;
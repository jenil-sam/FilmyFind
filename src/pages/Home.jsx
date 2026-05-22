import MovieCard from "../components/MovieCard";
import Recommendations from "../pages/Recommendations";
import { useState, useEffect } from "react";
import { searchMovies, getPopularMovies } from "../services/api";
import SearchBar from "../components/SearchBar";
import "../css/Home.css";

function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState(null);

    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies();
                setMovies(popularMovies);
            } catch (err) {
                console.log(err);
                setError("Failed to load movies...");
            } finally {
                setLoading(false);
            }
        };
        loadPopularMovies();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        if (loading) return;
        setLoading(true);
        try {
            const searchResults = await searchMovies(searchQuery);
            setMovies(searchResults);
            setError(null);
        } catch (err) {
            console.log(err);
            setError("Failed to search movies...");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home">
            <SearchBar onSearch={async (query) => {
                setLoading(true);
                try {
                    const searchResults = await searchMovies(query);
                    setMovies(searchResults);
                    setError(null);
                } catch (err) {
                    setError("Failed to search movies...");
                } finally {
                    setLoading(false);
                }
            }} />

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="movies-grid">
                    {movies.map((movie) => (
                        <MovieCard
                            movie={movie}
                            key={movie.id}
                            onSelect={() => setSelectedMovie(movie.title)}
                        />
                    ))}
                </div>
            )}

        </div>
    );
}

export default Home;
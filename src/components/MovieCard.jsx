import "../css/MovieCard.css"
import { useMovieContext } from "../contexts/MovieContext"

function MovieCard({ movie, onSelect }) {
    const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext()
    const favorite = isFavorite(movie.id)

    function onFavoriteClick(e) {
        e.preventDefault()
        if (favorite) removeFromFavorites(movie.id)
        else addToFavorites(movie)
    }

    return <div className="movie-card">
        <div className="movie-poster">
            <div class="front-side">
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            </div>

            <div className="back-side">
                <div className="movie-info">
                    <h2>{movie.original_title}</h2>
                    <p>{movie.overview}</p>
                </div>


            </div>
        </div>
        <div className="movie-info">
            <h3>{movie.title}</h3>
            <p>{movie.release_date?.split("-")[0]}</p>

            <div className="movie-overlay">
                <button className={`favorite-btn ${favorite ? "active" : ""}`} onClick={onFavoriteClick}>
                    ♥
                </button>
            </div>
        </div>
    </div>
}

export default MovieCard
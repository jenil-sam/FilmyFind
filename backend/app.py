from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import time
import os

app = Flask(__name__)
CORS(app)

TMDB_API_KEY = os.environ.get("TMDB_API_KEY")
movies_df = None
tfidf_matrix = None
vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1,2), min_df=2)

def fetch_movies():
    global movies_df, tfidf_matrix
    movies = []
    endpoints = [
        "movie/popular",
        "movie/top_rated",
        "movie/now_playing",
        "movie/upcoming",
    ]
    for endpoint in endpoints:
        for page in range(1, 26):
            try:
                url = f"https://api.themoviedb.org/3/{endpoint}?api_key={TMDB_API_KEY}&page={page}"
                res = requests.get(url, timeout=10).json()
                results = res.get("results", [])
                if not results:
                    break
                movies.extend(results)
            except Exception as e:
                print(f"Error fetching {endpoint} page {page}: {e}")
                continue

    df = pd.DataFrame(movies)
    df = df[["id", "title", "overview", "poster_path", "vote_average", "genre_ids"]].dropna()
    df = df[df["overview"].str.strip() != ""]
    df = df.drop_duplicates(subset="id").reset_index(drop=True)
    df["combined"] = df["overview"] + " " + df["genre_ids"].apply(
        lambda ids: " ".join([str(i) for i in ids] * 3)
    )
    movies_df = df
    tfidf_matrix = vectorizer.fit_transform(movies_df["combined"])
    print(f"Loaded {len(movies_df)} movies")

@app.route("/recommend", methods=["GET"])
def recommend():
    if movies_df is None:
        return jsonify({"error": "Movies not loaded yet, try again in a moment"}), 503
    title = request.args.get("title", "")
    if not title:
        return jsonify({"error": "No title provided"}), 400
    matches = movies_df[movies_df["title"].str.lower() == title.lower()]

    if matches.empty:
        return jsonify({"error": "Movie not found"}), 404
    
    start = time.time()

    idx = matches.index[0]
    scores = cosine_similarity(tfidf_matrix[idx], tfidf_matrix).flatten()
    top_indices = scores.argsort()[::-1][1:11]
    recommendations = movies_df.iloc[top_indices][["id", "title", "overview", "poster_path", "vote_average"]].to_dict(orient="records")

    end = time.time()
    print(f"Recommendation time: {(end - start) * 1000:.2f}ms")
    return jsonify(recommendations)

@app.route("/health", methods=["GET"])
def health():
    status = "ready" if movies_df is not None else "loading"
    return jsonify({"status": status, "movies_loaded": len(movies_df) if movies_df is not None else 0})

fetch_movies()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
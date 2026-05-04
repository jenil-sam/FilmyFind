from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
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
        for page in range(1, 51):
            url = f"https://api.themoviedb.org/3/{endpoint}?api_key={TMDB_API_KEY}&page={page}"
            res = requests.get(url).json()
            results = res.get("results", [])
            if not results:
                break
            movies.extend(results)
    
    movies_df = pd.DataFrame(movies)[["id", "title", "overview", "poster_path", "vote_average", "genre_ids"]].dropna()
    movies_df = movies_df[movies_df["overview"].str.strip() != ""]
    movies_df = movies_df.drop_duplicates(subset="id").reset_index(drop=True)
    
    movies_df["combined"] = movies_df["overview"] + " " + movies_df["genre_ids"].apply(
        lambda ids: " ".join([str(i) for i in ids] * 3)
    )
    
    tfidf_matrix = vectorizer.fit_transform(movies_df["combined"])
    print(f"Loaded {len(movies_df)} movies")



@app.route("/recommend", methods=["GET"])
def recommend():
    title = request.args.get("title", "")
    if not title:
        return jsonify({"error": "No title provided"}), 400

    matches = movies_df[movies_df["title"].str.lower() == title.lower()]
    if matches.empty:
        return jsonify({"error": "Movie not found"}), 404

    idx = matches.index[0]
    scores = cosine_similarity(tfidf_matrix[idx], tfidf_matrix).flatten()
    top_indices = scores.argsort()[::-1][1:7]
    recommendations = movies_df.iloc[top_indices][["id", "title", "overview", "poster_path", "vote_average"]].to_dict(orient="records")
    return jsonify(recommendations)

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

fetch_movies()

if __name__ == "__main__":
    app.run(debug=True)
# FilmFind

A full stack movie discovery platform that provides personalized recommendations using a machine learning backend. The app fetches real-time movie data from the TMDb API and uses a Python/Flask microservice to recommend similar titles based on plot descriptions.

Live Demo: https://filmyfind.netlify.app/

## How It Works

When you favorite a movie, FilmFind sends the title to a recommendation engine that uses TF-IDF vectorization and cosine similarity to find the most similar movies from a dataset of 2000+ titles. Results appear on the Recommendations page grouped by each favorited movie.

## Features

- Real-time movie data from TMDb API
- AI-powered recommendation engine using TF-IDF vectorization and cosine similarity
- Personalized recommendations based on your favorited movies
- Responsive and interactive UI built with React
- Flask microservice deployed separately on Render

## Tech Stack

**Frontend:** React, JavaScript, HTML, CSS
**Backend:** Python, Flask, scikit-learn
**API:** TMDb
**Deployment:** Netlify (frontend), Render (backend)

## Getting Started

### Prerequisites
- Node.js and npm
- Python 3.11+

### Frontend
```bash
git clone https://github.com/jenil-sam/FilmyFind.git
cd FilmyFind
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### Environment Variables
Create a `.env` file in the backend folder:
TMDB_API_KEY=your_api_key_here


## Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://people.tamu.edu/~jenilsam/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/jenil-sam/)

## Badges
![React](https://img.shields.io/badge/Frontend-React-blue)
![Python](https://img.shields.io/badge/Backend-Python-green)
![Flask](https://img.shields.io/badge/Framework-Flask-lightgrey)
![scikit-learn](https://img.shields.io/badge/ML-scikit--learn-orange)
![TMDb](https://img.shields.io/badge/API-TMDb-01d277)
![Netlify](https://img.shields.io/badge/Frontend-Netlify-brightgreen)
![Render](https://img.shields.io/badge/Backend-Render-purple)

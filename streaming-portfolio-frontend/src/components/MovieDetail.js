// src/components/MovieDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const MovieDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(`/api/movies/${id}`)
            .then((response) => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            })
            .then((data) => setMovie(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>Erro: {error}</p>;
    if (!movie) return <p>Não encontrado.</p>;

    const addFav = () => {
        try {
            const raw = localStorage.getItem('favorites');
            const list = raw ? JSON.parse(raw) : [];
            const exists = list.find((f) => f.id === movie.id);
            const next = exists ? list : [...list, { id: movie.id, title: movie.title, year: movie.year }];
            localStorage.setItem('favorites', JSON.stringify(next));
        } catch {}
    };

    return (
        <div>
            <div className="detail">
                {movie.posterUrl && (
                    <img className="poster" src={movie.posterUrl} alt={movie.title} />
                )}
                <div>
                    <h1 style={{ marginTop: 0 }}>{movie.title}</h1>
                    <div className="meta">{movie.year} • {Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres}</div>
                    <p style={{ lineHeight: 1.7 }}>{movie.description}</p>
                    <button className="button" onClick={addFav}>Adicionar aos favoritos</button>
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;



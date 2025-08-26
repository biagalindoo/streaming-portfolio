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

    return (
        <div>
            <h1>{movie.title}</h1>
            {movie.posterUrl && (
                <img src={movie.posterUrl} alt={movie.title} style={{ maxWidth: 240, borderRadius: 8 }} />
            )}
            <p>{movie.description}</p>
            <p><strong>Ano:</strong> {movie.year}</p>
            <p><strong>Gêneros:</strong> {Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres}</p>
        </div>
    );
};

export default MovieDetail;



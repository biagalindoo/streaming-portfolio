// src/components/MovieDetail.js
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from './Toast';

const MovieDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(`/api/catalog/${id}`)
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

    const { authHeaders } = useContext(AuthContext);
    const toast = useToast();
    const addFav = async () => {
        try {
            const res = await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...authHeaders() },
                body: JSON.stringify({ itemId: movie.id }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || 'Falha ao favoritar');
            }
            toast.success('Adicionado aos favoritos!');
        } catch (e) {
            console.error(e);
            toast.error(e.message || 'Falha ao favoritar');
        }
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



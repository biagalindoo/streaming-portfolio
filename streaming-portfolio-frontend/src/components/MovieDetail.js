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
                {movie.coverUrl && (
                    <img className="poster" src={movie.coverUrl} alt={movie.title} />
                )}
                <div>
                    <h1 style={{ marginTop: 0 }}>{movie.title}</h1>
                    <div className="meta">{movie.year || ''} {movie.genres ? `• ${Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres}` : ''}</div>
                    <p style={{ lineHeight: 1.7 }}>{movie.description}</p>
                    <button className="button" onClick={addFav}>Adicionar aos favoritos</button>
                </div>
            </div>
            {movie.type === 'show' && (
                <ShowEpisodes parentId={movie.id} />
            )}
        </div>
    );
};

export default MovieDetail;

const ShowEpisodes = ({ parentId }) => {
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch('/api/catalog')
            .then(r => { if (!r.ok) throw new Error('Falha ao carregar episódios'); return r.json(); })
            .then(data => {
                const eps = data.filter(i => i.type === 'episode' && i.showId === parentId);
                setEpisodes(eps);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [parentId]);

    if (loading) return <p>Carregando episódios...</p>;
    if (error) return <p>Erro: {error}</p>;
    if (!episodes.length) return null;

    const bySeason = episodes.reduce((acc, ep) => {
        const s = ep.season || 0;
        if (!acc[s]) acc[s] = [];
        acc[s].push(ep);
        return acc;
    }, {});

    return (
        <div style={{ marginTop: 24 }}>
            <h2>Temporadas e episódios</h2>
            {Object.keys(bySeason).sort((a,b)=>Number(a)-Number(b)).map(season => (
                <div key={season} style={{ marginBottom: 16 }}>
                    <h3 style={{ marginBottom: 8 }}>Temporada {season}</h3>
                    <div className="grid">
                        {bySeason[season].sort((a,b)=>a.episodeNumber-b.episodeNumber).map(ep => (
                            <div key={ep.id} className="card">
                                {ep.coverUrl ? <img src={ep.coverUrl} alt={ep.title} /> : <div style={{ height: 160 }} />}
                                <div className="card-body">
                                    <div className="card-title">Ep {ep.episodeNumber}: {ep.title}</div>
                                    <div className="card-meta">{ep.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};



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
    const { user, authHeaders } = useContext(AuthContext);
    const toast = useToast();

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
                    <h1 style={{ marginTop: 0, fontSize: '2.5rem', marginBottom: '0.5rem' }}>{movie.title}</h1>
                    <div className="meta" style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                        {movie.year || ''} {movie.genres ? `• ${Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres}` : ''}
                    </div>
                    <p style={{ lineHeight: 1.8, fontSize: '1.1rem', marginBottom: '2rem' }}>{movie.description}</p>
                    {user && (
                        <button className="button" onClick={addFav} style={{ fontSize: '1rem', padding: '12px 24px' }}>
                            Adicionar aos favoritos
                        </button>
                    )}
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
        <div style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Temporadas e episódios</h2>
            {Object.keys(bySeason).sort((a,b)=>Number(a)-Number(b)).map(season => (
                <div key={season} style={{ marginBottom: 32 }}>
                    <h3 style={{ 
                        marginBottom: 16, 
                        fontSize: '1.5rem', 
                        color: 'var(--accent)',
                        borderBottom: '2px solid var(--accent)',
                        paddingBottom: '8px',
                        display: 'inline-block'
                    }}>
                        Temporada {season}
                    </h3>
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                        {bySeason[season].sort((a,b)=>a.episodeNumber-b.episodeNumber).map(ep => (
                            <div key={ep.id} className="card" style={{ 
                                background: 'rgba(255,255,255,0.02)', 
                                border: '1px solid rgba(255,255,255,0.1)',
                                transition: 'all 0.3s ease'
                            }}>
                                {ep.coverUrl ? (
                                    <img src={ep.coverUrl} alt={ep.title} style={{ height: 200, objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ 
                                        height: 200, 
                                        background: 'linear-gradient(45deg, var(--primary), var(--accent))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '1.2rem'
                                    }}>
                                        Ep {ep.episodeNumber}
                                    </div>
                                )}
                                <div className="card-body" style={{ padding: '16px' }}>
                                    <div className="card-title" style={{ 
                                        fontSize: '1.1rem', 
                                        marginBottom: '8px',
                                        fontWeight: 600
                                    }}>
                                        Ep {ep.episodeNumber}: {ep.title}
                                    </div>
                                    <div className="card-meta" style={{ 
                                        fontSize: '0.9rem', 
                                        lineHeight: 1.5,
                                        color: 'var(--muted)'
                                    }}>
                                        {ep.description}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};



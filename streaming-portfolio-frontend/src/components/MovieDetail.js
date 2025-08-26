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
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 32, alignItems: 'start' }}>
                {movie.coverUrl && (
                    <img 
                        src={movie.coverUrl} 
                        alt={movie.title} 
                        style={{ 
                            width: '100%', 
                            borderRadius: 16, 
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                        }} 
                    />
                )}
                <div>
                    <h1 style={{ marginTop: 0, fontSize: '2.5rem', marginBottom: '0.5rem', color: 'white' }}>{movie.title}</h1>
                    <div style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: '#8b93a7' }}>
                        {movie.year || ''} {movie.genres ? `• ${Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres}` : ''}
                    </div>
                    <p style={{ lineHeight: 1.8, fontSize: '1.1rem', marginBottom: '2rem', color: 'white' }}>{movie.description}</p>
                    {user && (
                        <button 
                            onClick={addFav} 
                            style={{ 
                                fontSize: '1rem', 
                                padding: '12px 24px',
                                height: 44,
                                borderRadius: 10,
                                border: 'none',
                                background: '#6c5ce7',
                                color: 'white',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
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
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'white' }}>Temporadas e episódios</h2>
            {Object.keys(bySeason).sort((a,b)=>Number(a)-Number(b)).map(season => (
                <div key={season} style={{ marginBottom: 32 }}>
                    <h3 style={{ 
                        marginBottom: 16, 
                        fontSize: '1.5rem', 
                        color: '#00d4ff',
                        borderBottom: '2px solid #00d4ff',
                        paddingBottom: '8px',
                        display: 'inline-block'
                    }}>
                        Temporada {season}
                    </h3>
                    <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                        {bySeason[season].sort((a,b)=>a.episodeNumber-b.episodeNumber).map(ep => (
                            <div key={ep.id} style={{ 
                                background: 'rgba(255,255,255,0.02)', 
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 12,
                                overflow: 'hidden',
                                transition: 'all 0.3s ease'
                            }}>
                                {ep.coverUrl ? (
                                    <img src={ep.coverUrl} alt={ep.title} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ 
                                        height: 200, 
                                        background: 'linear-gradient(45deg, #6c5ce7, #00d4ff)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '1.2rem'
                                    }}>
                                        Ep {ep.episodeNumber}
                                    </div>
                                )}
                                <div style={{ padding: '16px' }}>
                                    <div style={{ 
                                        fontSize: '1.1rem', 
                                        marginBottom: '8px',
                                        fontWeight: 600,
                                        color: 'white'
                                    }}>
                                        Ep {ep.episodeNumber}: {ep.title}
                                    </div>
                                    <div style={{ 
                                        fontSize: '0.9rem', 
                                        lineHeight: 1.5,
                                        color: '#8b93a7'
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



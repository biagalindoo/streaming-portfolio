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
    const [isFavorited, setIsFavorited] = useState(false);
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

    // Verificar se o item está nos favoritos
    useEffect(() => {
        if (!user || !movie) return;

        fetch('/api/favorites', {
            headers: { ...authHeaders() }
        })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            })
            .then(data => {
                const favorited = data.favorites && data.favorites.includes(movie.id);
                setIsFavorited(favorited);
            })
            .catch(err => console.error('Erro ao verificar favoritos:', err));
    }, [user, movie, authHeaders]);

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>Erro: {error}</p>;
    if (!movie) return <p>Não encontrado.</p>;
    const toggleFav = async () => {
        try {
            if (isFavorited) {
                // Remover dos favoritos
                const res = await fetch(`/api/favorites/${movie.id}`, {
                    method: 'DELETE',
                    headers: { ...authHeaders() },
                });
                if (res.ok || res.status === 204) {
                    setIsFavorited(false);
                    toast.success('Removido dos favoritos');
                } else {
                    throw new Error('Falha ao remover dos favoritos');
                }
            } else {
                // Adicionar aos favoritos
                const res = await fetch('/api/favorites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', ...authHeaders() },
                    body: JSON.stringify({ itemId: movie.id }),
                });
                if (res.ok) {
                    setIsFavorited(true);
                    toast.success('Adicionado aos favoritos!');
                } else {
                    throw new Error('Falha ao adicionar aos favoritos');
                }
            }
        } catch (e) {
            console.error(e);
            toast.error(e.message || 'Falha ao atualizar favoritos');
        }
    };

    const handleWatch = () => {
        if (movie.videoUrl) {
            window.open(movie.videoUrl, '_blank');
        } else {
            alert(`🎬 Assistindo: ${movie.title}`);
        }
    };

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* Hero Section */}
            <div style={{ 
                position: 'relative', 
                height: '500px', 
                borderRadius: '20px', 
                overflow: 'hidden',
                marginBottom: '40px',
                background: `linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%), url(${movie.coverUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '40px'
            }}>
                <div style={{ 
                    background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.9) 100%)',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '60%'
                }} />
                <div style={{ position: 'relative', zIndex: 2, color: 'white' }}>
                    <h1 style={{ 
                        fontSize: '3.5rem', 
                        marginBottom: '1rem', 
                        fontWeight: 700,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                    }}>
                        {movie.title}
                    </h1>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '20px', 
                        marginBottom: '1.5rem',
                        fontSize: '1.1rem'
                    }}>
                        <span style={{ color: '#00d4ff', fontWeight: 600 }}>{movie.year || '2024'}</span>
                        <span style={{ color: '#8b93a7' }}>•</span>
                        <span style={{ color: '#8b93a7' }}>{movie.type === 'movie' ? 'Filme' : 'Série'}</span>
                        <span style={{ color: '#8b93a7' }}>•</span>
                        <span style={{ color: '#8b93a7' }}>{movie.duration || (movie.type === 'movie' ? '2h 15min' : '8 Episódios')}</span>
                        {movie.genres && (
                            <>
                                <span style={{ color: '#8b93a7' }}>•</span>
                                <span style={{ color: '#8b93a7' }}>
                                    {Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres}
                                </span>
                            </>
                        )}
                    </div>
                    <p style={{ 
                        lineHeight: 1.6, 
                        fontSize: '1.2rem', 
                        marginBottom: '2rem',
                        maxWidth: '600px',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}>
                        {movie.description}
                    </p>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <button 
                            onClick={handleWatch}
                            style={{ 
                                background: '#00d4ff',
                                color: '#000',
                                border: 'none',
                                padding: '16px 32px',
                                borderRadius: '8px',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            ▶ Assistir
                        </button>
                        {user && (
                            <button 
                                onClick={toggleFav} 
                                style={{ 
                                    background: isFavorited ? '#ff6b6b' : 'rgba(255,255,255,0.1)',
                                    color: 'white',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    padding: '16px 24px',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                {isFavorited ? '✓ Na Lista' : '+ Minha Lista'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 40 }}>
                {/* Sidebar */}
                <div>
                    <div style={{ 
                        background: 'rgba(255,255,255,0.05)', 
                        borderRadius: '16px', 
                        padding: '24px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <h3 style={{ color: 'white', marginBottom: '16px', fontSize: '1.2rem' }}>Detalhes</h3>
                        <div style={{ color: '#8b93a7', fontSize: '0.9rem', lineHeight: 1.6 }}>
                            <div style={{ marginBottom: '12px' }}>
                                <strong style={{ color: 'white' }}>Tipo:</strong> {movie.type === 'movie' ? 'Filme' : 'Série'}
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <strong style={{ color: 'white' }}>Ano:</strong> {movie.year || '2024'}
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <strong style={{ color: 'white' }}>Duração:</strong> {movie.duration || (movie.type === 'movie' ? '2h 15min' : '8 Episódios')}
                            </div>
                            {movie.genres && (
                                <div style={{ marginBottom: '12px' }}>
                                    <strong style={{ color: 'white' }}>Gêneros:</strong> {Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div>
                    {movie.type === 'show' && (
                        <ShowEpisodes parentId={movie.id} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;

const ShowEpisodes = ({ parentId }) => {
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState(1);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch('/api/catalog')
            .then(r => { if (!r.ok) throw new Error('Falha ao carregar episódios'); return r.json(); })
            .then(data => {
                const eps = data.filter(i => i.type === 'episode' && i.showId === parentId);
                setEpisodes(eps);
                if (eps.length > 0) {
                    setSelectedSeason(Math.min(...eps.map(e => e.season || 1)));
                }
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [parentId]);

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '40px', color: 'white' }}>
            <div style={{ fontSize: '1.2rem' }}>Carregando episódios...</div>
        </div>
    );
    if (error) return (
        <div style={{ textAlign: 'center', padding: '40px', color: '#ff6b6b' }}>
            <div style={{ fontSize: '1.2rem' }}>Erro: {error}</div>
        </div>
    );
    if (!episodes.length) return null;

    const bySeason = episodes.reduce((acc, ep) => {
        const s = ep.season || 1;
        if (!acc[s]) acc[s] = [];
        acc[s].push(ep);
        return acc;
    }, {});

    const seasons = Object.keys(bySeason).sort((a,b) => Number(a) - Number(b));
    const currentSeasonEpisodes = bySeason[selectedSeason] || [];

    return (
        <div>
            {/* Season Selector */}
            <div style={{ 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '16px', 
                padding: '24px',
                marginBottom: '32px',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)'
            }}>
                <h2 style={{ 
                    fontSize: '2rem', 
                    marginBottom: '24px', 
                    color: 'white',
                    fontWeight: 600
                }}>
                    Episódios
                </h2>
                
                {/* Season Tabs */}
                <div style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    marginBottom: '24px',
                    flexWrap: 'wrap'
                }}>
                    {seasons.map(season => (
                        <button
                            key={season}
                            onClick={() => setSelectedSeason(Number(season))}
                            style={{
                                background: selectedSeason === Number(season) ? '#00d4ff' : 'rgba(255,255,255,0.1)',
                                color: selectedSeason === Number(season) ? '#000' : 'white',
                                border: 'none',
                                padding: '12px 20px',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            Temporada {season}
                            <span style={{ 
                                background: selectedSeason === Number(season) ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                fontWeight: 500
                            }}>
                                {bySeason[season].length}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Season Info */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px',
                    color: '#8b93a7',
                    fontSize: '0.9rem'
                }}>
                    <span>Temporada {selectedSeason}</span>
                    <span>•</span>
                    <span>{currentSeasonEpisodes.length} episódios</span>
                    <span>•</span>
                    <span>Duração média: 45min</span>
                </div>
            </div>

            {/* Episodes Grid */}
            <div style={{ 
                display: 'grid', 
                gap: '16px'
            }}>
                {currentSeasonEpisodes
                    .sort((a,b) => a.episodeNumber - b.episodeNumber)
                    .map((ep, index) => (
                        <div key={ep.id} style={{ 
                            background: 'rgba(255,255,255,0.03)', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            cursor: 'pointer'
                        }}>
                            {/* Episode Thumbnail */}
                            <div style={{ width: '200px', flexShrink: 0 }}>
                                {ep.coverUrl ? (
                                    <img 
                                        src={ep.coverUrl} 
                                        alt={ep.title} 
                                        style={{ 
                                            width: '100%', 
                                            height: '120px', 
                                            objectFit: 'cover' 
                                        }} 
                                    />
                                ) : (
                                    <div style={{ 
                                        height: '120px', 
                                        background: 'linear-gradient(45deg, #6c5ce7, #00d4ff)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '1rem',
                                        fontWeight: 600
                                    }}>
                                        Ep {ep.episodeNumber}
                                    </div>
                                )}
                            </div>

                            {/* Episode Info */}
                            <div style={{ 
                                padding: '20px', 
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}>
                                <div>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '12px',
                                        marginBottom: '8px'
                                    }}>
                                        <span style={{ 
                                            fontSize: '1.1rem', 
                                            fontWeight: 600,
                                            color: 'white'
                                        }}>
                                            {ep.episodeNumber}. {ep.title}
                                        </span>
                                        <span style={{ 
                                            color: '#8b93a7', 
                                            fontSize: '0.9rem'
                                        }}>
                                            {ep.duration || '45min'}
                                        </span>
                                    </div>
                                    <p style={{ 
                                        fontSize: '0.95rem', 
                                        lineHeight: 1.5,
                                        color: '#8b93a7',
                                        margin: 0
                                    }}>
                                        {ep.description}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div style={{ 
                                    display: 'flex', 
                                    gap: '12px',
                                    marginTop: '16px'
                                }}>
                                    <button 
                                        onClick={() => {
                                            if (ep.videoUrl) {
                                                window.open(ep.videoUrl, '_blank');
                                            } else {
                                                alert(`🎬 Assistindo episódio: ${ep.title}`);
                                            }
                                        }}
                                        style={{
                                            background: '#00d4ff',
                                            color: '#000',
                                            border: 'none',
                                            padding: '8px 16px',
                                            borderRadius: '6px',
                                            fontSize: '0.9rem',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        ▶ Assistir
                                    </button>
                                    <button style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        color: 'white',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer'
                                    }}>
                                        + Lista
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};



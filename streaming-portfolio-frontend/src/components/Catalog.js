// src/components/Catalog.js
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard';
import { useToast } from './Toast';
import { AuthContext } from '../context/AuthContext';

const FAV_KEY = 'favorites';

const Catalog = () => {
    const [series, setSeries] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [favorites, setFavorites] = useState([]);
    const [favoritesLoading, setFavoritesLoading] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/catalog')
            .then(response => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            })
            .then(data => setSeries(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    // Carregar favoritos do usuário
    useEffect(() => {
        if (!user) {
            setFavorites([]);
            setFavoritesLoading(false);
            return;
        }

        fetch('/api/favorites', {
            headers: { ...authHeaders() }
        })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            })
            .then(data => setFavorites(data.map(fav => fav.itemId)))
            .catch(err => console.error('Erro ao carregar favoritos:', err))
            .finally(() => setFavoritesLoading(false));
    }, [user, authHeaders]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const params = new URLSearchParams(location.search);
        const type = params.get('type');
        const genre = params.get('genre');
        
        let base = series;
        
        // Filtrar por tipo
        if (type === 'show' || type === 'movie') {
            base = base.filter(s => s.type === type);
        }
        
        // Filtrar por gênero
        if (genre) {
            base = base.filter(s => {
                if (!s.genres) return false;
                const genres = Array.isArray(s.genres) ? s.genres : [s.genres];
                return genres.some(g => g.toLowerCase() === genre.toLowerCase());
            });
        }
        
        // Filtrar por busca
        if (!q) return base;
        return base.filter(s => `${s.title} ${s.year || ''}`.toLowerCase().includes(q));
    }, [series, query, location.search]);

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>Erro: {error}</p>;

    const toast = useToast();
    const { user, authHeaders } = useContext(AuthContext);
    const toggleFav = async (item) => {
        try {
            const isFavorited = favorites.includes(item.id);
            
            if (isFavorited) {
                // Remover dos favoritos
                const delRes = await fetch(`/api/favorites/${item.id}`, {
                    method: 'DELETE',
                    headers: { ...authHeaders() },
                });
                if (delRes.ok || delRes.status === 204) {
                    setFavorites(prev => prev.filter(id => id !== item.id));
                    toast.success('Removido dos favoritos');
                } else {
                    throw new Error('Falha ao remover dos favoritos');
                }
            } else {
                // Adicionar aos favoritos
                const addRes = await fetch('/api/favorites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', ...authHeaders() },
                    body: JSON.stringify({ itemId: item.id }),
                });
                if (addRes.ok) {
                    setFavorites(prev => [...prev, item.id]);
                    toast.success('Adicionado aos favoritos!');
                } else {
                    throw new Error('Falha ao adicionar aos favoritos');
                }
            }
        } catch (e) {
            toast.error(e.message || 'Erro ao atualizar favoritos');
        }
    };

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header Section */}
            <div style={{ 
                background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)',
                borderRadius: '20px',
                padding: '40px',
                marginBottom: '40px',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)'
            }}>
                <h1 style={{ 
                    color: 'white', 
                    fontSize: '3rem', 
                    marginBottom: '1rem',
                    fontWeight: 700,
                    textAlign: 'center'
                }}>
                    Explorar
                </h1>
                <p style={{ 
                    color: '#8b93a7', 
                    fontSize: '1.1rem', 
                    textAlign: 'center',
                    marginBottom: '32px'
                }}>
                    Descubra filmes e séries incríveis
                </p>
                
                {/* Search and Filter */}
                <div style={{ 
                    display: 'flex', 
                    gap: 16, 
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    <input
                        type="text"
                        placeholder="Buscar por título..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{ 
                            height: 48, 
                            borderRadius: 12, 
                            border: '1px solid rgba(255,255,255,0.2)', 
                            background: 'rgba(255,255,255,0.1)', 
                            color: 'white', 
                            padding: '0 20px',
                            fontSize: 16,
                            minWidth: '300px',
                            backdropFilter: 'blur(10px)'
                        }}
                    />
                    <select 
                        value={new URLSearchParams(location.search).get('type') || ''} 
                        onChange={(e) => {
                            const v = e.target.value;
                            const params = new URLSearchParams(location.search);
                            if (v) params.set('type', v); else params.delete('type');
                            navigate({ search: params.toString() });
                        }}
                        style={{ 
                            height: 48, 
                            borderRadius: 12, 
                            border: '1px solid rgba(255,255,255,0.2)', 
                            background: 'rgba(255,255,255,0.1)', 
                            color: 'white', 
                            padding: '0 20px',
                            fontSize: 16,
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <option value="">Todos os tipos</option>
                        <option value="show">Séries</option>
                        <option value="movie">Filmes</option>
                    </select>
                </div>
            </div>

            {/* Results Count */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '24px',
                padding: '0 8px'
            }}>
                <div style={{ color: '#8b93a7', fontSize: '1rem' }}>
                    {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'} encontrado{filtered.length !== 1 ? 's' : ''}
                </div>
                <div style={{ color: '#8b93a7', fontSize: '0.9rem' }}>
                    {new URLSearchParams(location.search).get('type') ? 
                        `Filtrando por: ${new URLSearchParams(location.search).get('type') === 'show' ? 'Séries' : 'Filmes'}` : 
                        'Mostrando todos'
                    }
                </div>
            </div>

            {/* Content Grid */}
            <div style={{ 
                display: 'grid', 
                gap: 24, 
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))'
            }}>
                {filtered.map((item) => (
                    <div key={item.id} style={{ 
                        position: 'relative',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.1)',
                        transition: 'all 0.3s ease',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <MovieCard id={item.id} title={item.title} posterUrl={item.coverUrl} year={item.year} />
                        {user && (
                            <div style={{ padding: '16px' }}>
                                <button 
                                    onClick={() => toggleFav(item)}
                                    style={{ 
                                        width: '100%', 
                                        height: 44,
                                        borderRadius: 10,
                                        border: 'none',
                                        background: '#00d4ff',
                                        color: '#000',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        fontSize: 14,
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    + Minha Lista
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filtered.length === 0 && !loading && (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '60px 20px',
                    color: '#8b93a7'
                }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '16px' }}>
                        Nenhum resultado encontrado
                    </div>
                    <div style={{ fontSize: '1rem' }}>
                        Tente ajustar os filtros ou a busca
                    </div>
                </div>
            )}
        </div>
    );
};

export default Catalog;

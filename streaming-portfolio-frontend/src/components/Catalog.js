// src/components/Catalog.js
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard';
import { useToast } from './Toast';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

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
    const { user, authHeaders, currentProfile } = useContext(AuthContext);
    const { colors } = useTheme();
    const toast = useToast();

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
            .then(data => setFavorites(data.favorites || []))
            .catch(err => console.error('Erro ao carregar favoritos:', err))
            .finally(() => setFavoritesLoading(false));
    }, [user, authHeaders]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const params = new URLSearchParams(location.search);
        const type = params.get('type');
        const genre = params.get('genre');
        
        // Filtrar apenas shows e movies (não episódios)
        let base = series.filter(s => s.type === 'show' || s.type === 'movie');
        
        // Filtrar por perfil ativo (controle parental)
        if (currentProfile) {
            const ageRatingOrder = ['L', '10', '12', '14', '16', '18'];
            const profileRatingIndex = ageRatingOrder.indexOf(currentProfile.restrictions.maxAgeRating);
            
            base = base.filter(s => {
                const contentRating = s.ageRating || 'L';
                const contentRatingIndex = ageRatingOrder.indexOf(contentRating);
                
                // Verificar classificação etária
                if (contentRatingIndex > profileRatingIndex) {
                    return false;
                }
                
                // Verificar restrições específicas
                if (s.hasViolence && !currentProfile.restrictions.allowViolence) {
                    return false;
                }
                
                if (s.hasLanguage && !currentProfile.restrictions.allowLanguage) {
                    return false;
                }
                
                if (s.hasAdultContent && !currentProfile.restrictions.allowAdultContent) {
                    return false;
                }
                
                return true;
            });
        }
        
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
    }, [series, query, location.search, currentProfile]);

    if (loading) return (
        <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            color: colors.text
        }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '16px' }}>
                Carregando catálogo...
            </div>
        </div>
    );
    
    if (error) return (
        <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            color: colors.error
        }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '16px' }}>
                Erro: {error}
            </div>
        </div>
    );
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
                background: colors.gradient,
                borderRadius: '20px',
                padding: '40px',
                marginBottom: '40px',
                border: `1px solid ${colors.border}`,
                backdropFilter: colors.backdropBlur
            }}>
                <h1 style={{ 
                    color: colors.text, 
                    fontSize: '3rem', 
                    marginBottom: '1rem',
                    fontWeight: 700,
                    textAlign: 'center'
                }}>
                    Explorar
                </h1>
                <p style={{ 
                    color: colors.textSecondary, 
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
                            border: `1px solid ${colors.borderHover}`, 
                            background: colors.backdrop, 
                            color: colors.text, 
                            padding: '0 20px',
                            fontSize: 16,
                            minWidth: '300px',
                            backdropFilter: colors.backdropBlur
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
                            border: `1px solid ${colors.borderHover}`, 
                            background: colors.backdrop, 
                            color: colors.text, 
                            padding: '0 20px',
                            fontSize: 16,
                            backdropFilter: colors.backdropBlur,
                            cursor: 'pointer'
                        }}
                    >
                        <option value="" style={{ background: colors.surface, color: colors.text }}>Todos os tipos</option>
                        <option value="show" style={{ background: colors.surface, color: colors.text }}>Séries</option>
                        <option value="movie" style={{ background: colors.surface, color: colors.text }}>Filmes</option>
                    </select>
                    <select 
                        value={new URLSearchParams(location.search).get('genre') || ''} 
                        onChange={(e) => {
                            const v = e.target.value;
                            const params = new URLSearchParams(location.search);
                            if (v) params.set('genre', v); else params.delete('genre');
                            navigate({ search: params.toString() });
                        }}
                        style={{ 
                            height: 48, 
                            borderRadius: 12, 
                            border: `1px solid ${colors.borderHover}`, 
                            background: colors.backdrop, 
                            color: colors.text, 
                            padding: '0 20px',
                            fontSize: 16,
                            backdropFilter: colors.backdropBlur,
                            cursor: 'pointer'
                        }}
                    >
                        <option value="" style={{ background: colors.surface, color: colors.text }}>Todos os gêneros</option>
                        <option value="Ação" style={{ background: colors.surface, color: colors.text }}>Ação</option>
                        <option value="Drama" style={{ background: colors.surface, color: colors.text }}>Drama</option>
                        <option value="Comédia" style={{ background: colors.surface, color: colors.text }}>Comédia</option>
                        <option value="Ficção Científica" style={{ background: colors.surface, color: colors.text }}>Ficção Científica</option>
                        <option value="Terror" style={{ background: colors.surface, color: colors.text }}>Terror</option>
                        <option value="Romance" style={{ background: colors.surface, color: colors.text }}>Romance</option>
                        <option value="Aventura" style={{ background: colors.surface, color: colors.text }}>Aventura</option>
                        <option value="Suspense" style={{ background: colors.surface, color: colors.text }}>Suspense</option>
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
                <div style={{ color: colors.textSecondary, fontSize: '1rem' }}>
                    {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'} encontrado{filtered.length !== 1 ? 's' : ''}
                </div>
                <div style={{ color: colors.textSecondary, fontSize: '0.9rem' }}>
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
                        background: colors.cardBackground,
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: `1px solid ${colors.border}`,
                        transition: 'all 0.3s ease',
                        backdropFilter: colors.backdropBlur
                    }}>
                        <MovieCard id={item.id} title={item.title} posterUrl={item.coverUrl} year={item.year} duration={item.duration} videoUrl={item.videoUrl} rating={item.rating} />
                        {user && (
                            <div style={{ padding: '16px' }}>
                                <button 
                                    onClick={() => toggleFav(item)}
                                    style={{ 
                                        width: '100%', 
                                        height: 44,
                                        borderRadius: 10,
                                        border: 'none',
                                        background: favorites.includes(item.id) ? colors.error : colors.primary,
                                        color: favorites.includes(item.id) ? 'white' : '#000',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        fontSize: 14,
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {favorites.includes(item.id) ? '✓ Na Lista' : '+ Minha Lista'}
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
                    color: colors.textSecondary
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

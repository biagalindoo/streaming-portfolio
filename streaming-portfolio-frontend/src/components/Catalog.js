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
        if (currentProfile && currentProfile.restrictions && currentProfile.restrictions.maxAgeRating) {
            console.log('=== VERIFICAÇÃO DO PERFIL ===');
            console.log('Perfil completo:', JSON.stringify(currentProfile, null, 2));
            console.log('isChild:', currentProfile.isChild, 'tipo:', typeof currentProfile.isChild);
            console.log('maxAgeRating:', currentProfile.restrictions.maxAgeRating);
            console.log('=== FIM VERIFICAÇÃO ===');
            console.log('=== FILTRO DE PERFIL ATIVO ===');
            console.log('Perfil atual:', currentProfile);
            console.log('Restrições:', currentProfile.restrictions);
            console.log('Total de itens antes do filtro:', base.length);
            
            const ageRatingOrder = ['L', '10', '12', '14', '16', '18'];
            const profileRatingIndex = ageRatingOrder.indexOf(currentProfile.restrictions.maxAgeRating);
            console.log('Índice da classificação do perfil:', profileRatingIndex, '(', currentProfile.restrictions.maxAgeRating, ')');
            
            let filteredCount = 0;
            let blockedCount = 0;
            
            base = base.filter(s => {
                const contentRating = s.ageRating || 'L';
                const contentRatingIndex = ageRatingOrder.indexOf(contentRating);
                
                console.log(`\nVerificando: ${s.title}`);
                console.log(`Classificação do conteúdo: ${contentRating} (índice: ${contentRatingIndex})`);
                console.log(`Classificação do perfil: ${currentProfile.restrictions.maxAgeRating} (índice: ${profileRatingIndex})`);
                
                // Verificar classificação etária - conteúdo deve ser igual ou menor que o perfil
                if (contentRatingIndex > profileRatingIndex) {
                    console.log(`❌ BLOQUEANDO ${s.title}: ${contentRating} > ${currentProfile.restrictions.maxAgeRating} (índice ${contentRatingIndex} > ${profileRatingIndex})`);
                    blockedCount++;
                    return false;
                }
                
                // Verificação adicional para garantir que perfis infantis não vejam conteúdo inadequado
                if (currentProfile.isChild === true && (contentRating === '14' || contentRating === '16' || contentRating === '18')) {
                    console.log(`❌ BLOQUEANDO ${s.title}: perfil infantil não pode ver conteúdo ${contentRating}`);
                    blockedCount++;
                    return false;
                }
                
                // Para perfis infantis, aplicar restrições mais rigorosas
                if (currentProfile.isChild === true) {
                    console.log('Perfil infantil detectado - aplicando restrições rigorosas');
                    
                    // Bloquear conteúdo 16+ e 18+ para perfis infantis
                    if (contentRating === '16' || contentRating === '18') {
                        console.log(`❌ BLOQUEANDO ${s.title}: conteúdo ${contentRating} não permitido para perfis infantis`);
                        blockedCount++;
                        return false;
                    }
                    
                    // Verificar restrições específicas
                    if (s.hasViolence && !currentProfile.restrictions.allowViolence) {
                        console.log(`❌ BLOQUEANDO ${s.title}: violência não permitida`);
                        blockedCount++;
                        return false;
                    }
                    
                    if (s.hasLanguage && !currentProfile.restrictions.allowLanguage) {
                        console.log(`❌ BLOQUEANDO ${s.title}: linguagem inadequada`);
                        blockedCount++;
                        return false;
                    }
                    
                    if (s.hasAdultContent && !currentProfile.restrictions.allowAdultContent) {
                        console.log(`❌ BLOQUEANDO ${s.title}: conteúdo adulto`);
                        blockedCount++;
                        return false;
                    }
                }
                
                console.log(`✅ PERMITINDO ${s.title}: ${contentRating} <= ${currentProfile.restrictions.maxAgeRating}`);
                filteredCount++;
                return true;
            });
            
            console.log(`=== FIM DO FILTRO ===`);
            console.log(`Total bloqueado: ${blockedCount}`);
            console.log(`Total permitido: ${filteredCount}`);
            console.log(`Total final: ${base.length}\n`);
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
                {currentProfile && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        marginBottom: '20px',
                        padding: '10px 20px',
                        background: currentProfile.isChild ? 'rgba(255, 107, 107, 0.2)' : 'rgba(0, 255, 0, 0.2)',
                        borderRadius: '20px',
                        border: `1px solid ${currentProfile.isChild ? '#ff6b6b' : '#00ff00'}`
                    }}>
                        <span style={{ fontSize: '1.5rem' }}>{currentProfile.avatar}</span>
                        <span style={{ 
                            color: colors.text, 
                            fontSize: '1.1rem',
                            fontWeight: '600'
                        }}>
                            Perfil: {currentProfile.name} ({currentProfile.age} anos)
                        </span>
                        {currentProfile.isChild && (
                            <span style={{
                                background: '#ff6b6b',
                                color: 'white',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                fontWeight: '600'
                            }}>
                                👶 Infantil
                            </span>
                        )}
                    </div>
                )}
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
                                                 <MovieCard id={item.id} title={item.title} posterUrl={item.coverUrl} year={item.year} duration={item.duration} videoUrl={item.videoUrl} rating={item.rating} ageRating={item.ageRating} />
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

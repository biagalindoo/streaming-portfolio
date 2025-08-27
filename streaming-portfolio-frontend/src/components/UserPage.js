// src/components/UserPage.js
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from './Toast';

const FAV_KEY = 'favorites';

const UserPage = () => {
    const { user, authHeaders } = useContext(AuthContext);
    const { colors } = useTheme();
    const toast = useToast();
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let active = true;
        async function loadFavs() {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch('/api/favorites', { headers: { ...authHeaders() } });
                if (!res.ok) throw new Error('Falha ao carregar favoritos');
                const data = await res.json();
                if (active) setFavoriteIds(Array.isArray(data.favorites) ? data.favorites : []);
            } catch (e) {
                if (active) setError(e.message);
            } finally {
                if (active) setLoading(false);
            }
        }
        loadFavs();
        return () => { active = false; };
    }, [authHeaders]);

    return (
        <div style={{ 
            backgroundColor: colors.background, 
            minHeight: '100vh', 
            padding: '40px 20px' 
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ 
                    background: colors.surface,
                    borderRadius: '12px',
                    padding: '30px',
                    border: `1px solid ${colors.border}`,
                    marginBottom: '30px'
                }}>
                    <h1 style={{ 
                        color: colors.text, 
                        fontSize: '2.5rem', 
                        marginBottom: '20px' 
                    }}>
                        👋 Olá, {user?.name || user?.email}
                    </h1>
                    
                    <div style={{ 
                        display: 'flex', 
                        gap: '20px',
                        marginBottom: '20px'
                    }}>
                        <Link 
                            to={`/profile/${user?.id}`}
                            style={{
                                background: colors.primary,
                                color: '#000',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontWeight: '600',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            👤 Ver Meu Perfil
                        </Link>
                        
                        <Link 
                            to="/my-list"
                            style={{
                                background: colors.secondary,
                                color: 'white',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontWeight: '600',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            ❤️ Minha Lista
                        </Link>
                    </div>
                </div>

                <div style={{ 
                    background: colors.surface,
                    borderRadius: '12px',
                    padding: '30px',
                    border: `1px solid ${colors.border}`
                }}>
                    <h2 style={{ 
                        color: colors.text, 
                        fontSize: '2rem', 
                        marginBottom: '20px' 
                    }}>
                        ❤️ Meus Favoritos
                    </h2>
                    
                    {loading && (
                        <p style={{ color: colors.textSecondary }}>Carregando...</p>
                    )}
                    
                    {error && (
                        <p style={{ color: colors.error }}>Erro: {error}</p>
                    )}
                    
                    {!loading && !error && favoriteIds.length === 0 && (
                        <p style={{ color: colors.textSecondary }}>
                            Você ainda não adicionou favoritos. 
                            <Link 
                                to="/" 
                                style={{ 
                                    color: colors.primary, 
                                    textDecoration: 'none',
                                    marginLeft: '5px'
                                }}
                            >
                                Explorar catálogo
                            </Link>
                        </p>
                    )}
                    
                    {!loading && !error && favoriteIds.length > 0 && (
                        <div>
                            <p style={{ 
                                color: colors.textSecondary, 
                                marginBottom: '15px' 
                            }}>
                                {favoriteIds.length} item{favoriteIds.length !== 1 ? 's' : ''} favorito{favoriteIds.length !== 1 ? 's' : ''}
                            </p>
                            <ul style={{ 
                                listStyle: 'none', 
                                padding: 0,
                                display: 'grid',
                                gap: '10px'
                            }}>
                                {favoriteIds.map((id) => (
                                    <li key={id} style={{
                                        background: colors.cardBackground,
                                        padding: '10px 15px',
                                        borderRadius: '6px',
                                        border: `1px solid ${colors.border}`,
                                        color: colors.text
                                    }}>
                                        {id}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserPage;



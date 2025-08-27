import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from './Toast';
import MovieCard from './MovieCard';
import './UserProfile.css';

const UserProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser, token } = useAuth();
    const { colors } = useTheme();
    const toast = useToast();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [lists, setLists] = useState([]);
    const [shows, setShows] = useState([]);

    useEffect(() => {
        if (id) {
            fetchProfile();
            fetchLists();
            fetchShows();
        }
    }, [id]);

    const fetchProfile = async () => {
        try {
            const response = await fetch(`/api/social/profiles/${id}`);
            if (!response.ok) throw new Error('Perfil não encontrado');
            
            const data = await response.json();
            setProfile(data);
            
            // Check if current user is following this profile
            if (currentUser && data.followers) {
                setIsFollowing(data.followers.includes(currentUser.id));
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchLists = async () => {
        try {
            const response = await fetch(`/api/social/lists`);
            if (response.ok) {
                const data = await response.json();
                const userLists = data.filter(list => list.creator.id === parseInt(id));
                setLists(userLists);
            }
        } catch (err) {
            console.error('Error fetching lists:', err);
        }
    };

    const fetchShows = async () => {
        try {
            const response = await fetch('/api/catalog');
            if (response.ok) {
                const data = await response.json();
                setShows(data);
            }
        } catch (err) {
            console.error('Error fetching shows:', err);
        }
    };

    const handleFollow = async () => {
        if (!token) {
            toast.error('Faça login para seguir usuários');
            return;
        }

        try {
            const response = await fetch(`/api/social/follow/${id}`, {
                method: isFollowing ? 'DELETE' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setIsFollowing(!isFollowing);
                toast.success(isFollowing ? 'Deixou de seguir' : 'Seguindo usuário');
                fetchProfile(); // Refresh profile to update stats
            } else {
                throw new Error('Erro ao seguir/deixar de seguir');
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleShare = async (itemId, itemTitle) => {
        if (!token) {
            toast.error('Faça login para compartilhar');
            return;
        }

        try {
            const response = await fetch('/api/social/share', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    itemId,
                    message: `Confira ${itemTitle} recomendado por ${profile.name}!`
                })
            });

            if (response.ok) {
                toast.success('Compartilhado com sucesso!');
            } else {
                throw new Error('Erro ao compartilhar');
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    if (loading) {
        return (
            <div style={{ color: colors.text, textAlign: 'center', padding: '2rem' }}>
                Carregando perfil...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ color: colors.error, textAlign: 'center', padding: '2rem' }}>
                Erro: {error}
            </div>
        );
    }

    if (!profile) {
        return (
            <div style={{ color: colors.text, textAlign: 'center', padding: '2rem' }}>
                Perfil não encontrado
            </div>
        );
    }

    const isOwnProfile = currentUser && currentUser.id === parseInt(id);

    return (
        <div className="user-profile" style={{ backgroundColor: colors.background, minHeight: '100vh' }}>
            {/* Header Section */}
            <div style={{ 
                background: colors.gradient,
                padding: '40px 20px',
                textAlign: 'center',
                color: 'white'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {/* Avatar */}
                    <div style={{ marginBottom: '20px' }}>
                        <img 
                            src={profile.avatar} 
                            alt={profile.name}
                            style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                border: '4px solid rgba(255,255,255,0.3)'
                            }}
                        />
                    </div>

                    {/* User Info */}
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{profile.name}</h1>
                    <p style={{ fontSize: '1.1rem', marginBottom: '20px', opacity: 0.9 }}>
                        @{profile.username}
                    </p>
                    
                    {profile.bio && (
                        <p style={{ fontSize: '1rem', marginBottom: '20px', maxWidth: '600px', margin: '0 auto' }}>
                            {profile.bio}
                        </p>
                    )}

                    {/* Stats */}
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        gap: '40px',
                        marginBottom: '20px'
                    }}>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                {profile.stats?.totalWatched || 0}
                            </div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Assistidos</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                {profile.stats?.totalLists || 0}
                            </div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Listas</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                {profile.stats?.totalFollowers || 0}
                            </div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Seguidores</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                {profile.stats?.totalFollowing || 0}
                            </div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Seguindo</div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {!isOwnProfile && (
                        <div style={{ marginTop: '20px' }}>
                            <button 
                                onClick={handleFollow}
                                style={{
                                    background: isFollowing ? colors.error : colors.primary,
                                    color: isFollowing ? 'white' : '#000',
                                    border: 'none',
                                    padding: '12px 24px',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    marginRight: '10px'
                                }}
                            >
                                {isFollowing ? 'Deixar de Seguir' : 'Seguir'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
                {/* Public Lists */}
                {lists.length > 0 && (
                    <section style={{ marginBottom: '40px' }}>
                        <h2 style={{ 
                            color: colors.text, 
                            fontSize: '2rem', 
                            marginBottom: '20px',
                            borderBottom: `2px solid ${colors.border}`,
                            paddingBottom: '10px'
                        }}>
                            Listas Públicas
                        </h2>
                        
                        <div style={{ 
                            display: 'grid', 
                            gap: '20px',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
                        }}>
                            {lists.map(list => (
                                <div key={list.id} style={{
                                    background: colors.surface,
                                    borderRadius: '12px',
                                    padding: '20px',
                                    border: `1px solid ${colors.border}`,
                                    transition: 'all 0.3s ease'
                                }}>
                                    <h3 style={{ 
                                        color: colors.text, 
                                        fontSize: '1.3rem', 
                                        marginBottom: '10px' 
                                    }}>
                                        {list.name}
                                    </h3>
                                    <p style={{ 
                                        color: colors.textSecondary, 
                                        fontSize: '0.9rem',
                                        marginBottom: '15px'
                                    }}>
                                        {list.description}
                                    </p>
                                    <div style={{ 
                                        color: colors.textSecondary, 
                                        fontSize: '0.8rem' 
                                    }}>
                                        {list.items.length} itens • Criado em {new Date(list.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Favorites Preview */}
                {profile.favorites && profile.favorites.length > 0 && (
                    <section>
                        <h2 style={{ 
                            color: colors.text, 
                            fontSize: '2rem', 
                            marginBottom: '20px',
                            borderBottom: `2px solid ${colors.border}`,
                            paddingBottom: '10px'
                        }}>
                            Favoritos
                        </h2>
                        
                        <div style={{ 
                            display: 'grid', 
                            gap: '20px',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))'
                        }}>
                            {profile.favorites.slice(0, 6).map(itemId => {
                                const show = shows.find(s => s.id === itemId);
                                if (!show) return null;
                                
                                return (
                                    <div key={itemId} style={{ position: 'relative' }}>
                                        <MovieCard 
                                            id={show.id}
                                            title={show.title}
                                            posterUrl={show.coverUrl}
                                            year={show.year}
                                            duration={show.duration}
                                            videoUrl={show.videoUrl}
                                            rating={show.rating}
                                        />
                                        {!isOwnProfile && (
                                            <button
                                                onClick={() => handleShare(show.id, show.title)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '10px',
                                                    right: '10px',
                                                    background: 'rgba(0,0,0,0.7)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    width: '40px',
                                                    height: '40px',
                                                    cursor: 'pointer',
                                                    fontSize: '1.2rem'
                                                }}
                                            >
                                                📤
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default UserProfile;

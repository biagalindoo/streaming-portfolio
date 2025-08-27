import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import MovieCard from './MovieCard';
import './Rankings.css';

const Rankings = () => {
    const { colors } = useTheme();
    const [rankings, setRankings] = useState({
        mostWatched: [],
        topUsers: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRankings();
    }, []);

    const fetchRankings = async () => {
        try {
            const response = await fetch('/api/social/rankings');
            if (!response.ok) throw new Error('Erro ao carregar rankings');
            
            const data = await response.json();
            setRankings(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ color: colors.text, textAlign: 'center', padding: '2rem' }}>
                Carregando rankings...
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

    return (
        <div className="rankings" style={{ backgroundColor: colors.background, minHeight: '100vh', padding: '20px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ 
                        color: colors.text, 
                        fontSize: '3rem', 
                        marginBottom: '10px',
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        🏆 Rankings
                    </h1>
                    <p style={{ color: colors.textSecondary, fontSize: '1.1rem' }}>
                        Descubra os filmes mais populares e os usuários mais ativos
                    </p>
                </div>

                <div style={{ display: 'grid', gap: '40px', gridTemplateColumns: '1fr 1fr' }}>
                    {/* Most Watched Shows */}
                    <section>
                        <h2 style={{ 
                            color: colors.text, 
                            fontSize: '2rem', 
                            marginBottom: '20px',
                            borderBottom: `2px solid ${colors.border}`,
                            paddingBottom: '10px'
                        }}>
                            📺 Mais Assistidos
                        </h2>
                        
                        <div style={{ 
                            display: 'grid', 
                            gap: '15px',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))'
                        }}>
                            {rankings.mostWatched.map((show, index) => (
                                <div key={show.id} style={{ position: 'relative' }}>
                                    {/* Rank Badge */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        left: '10px',
                                        background: index < 3 ? '#FFD700' : colors.primary,
                                        color: index < 3 ? '#000' : '#fff',
                                        borderRadius: '50%',
                                        width: '30px',
                                        height: '30px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem',
                                        zIndex: 2
                                    }}>
                                        {index + 1}
                                    </div>
                                    
                                    <MovieCard 
                                        id={show.id}
                                        title={show.title}
                                        posterUrl={show.coverUrl}
                                        year={show.year}
                                        duration={show.duration}
                                        videoUrl={show.videoUrl}
                                        rating={show.rating}
                                    />
                                    
                                    {/* Watch Count */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '10px',
                                        right: '10px',
                                        background: 'rgba(0,0,0,0.8)',
                                        color: 'white',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold'
                                    }}>
                                        👥 {show.watchCount}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Top Users */}
                    <section>
                        <h2 style={{ 
                            color: colors.text, 
                            fontSize: '2rem', 
                            marginBottom: '20px',
                            borderBottom: `2px solid ${colors.border}`,
                            paddingBottom: '10px'
                        }}>
                            👥 Top Usuários
                        </h2>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {rankings.topUsers.map((user, index) => (
                                <Link 
                                    key={user.id} 
                                    to={`/profile/${user.id}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div style={{
                                        background: colors.surface,
                                        borderRadius: '12px',
                                        padding: '15px',
                                        border: `1px solid ${colors.border}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        ':hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: `0 8px 25px ${colors.overlay}`
                                        }
                                    }}>
                                        {/* Rank */}
                                        <div style={{
                                            background: index < 3 ? '#FFD700' : colors.primary,
                                            color: index < 3 ? '#000' : '#fff',
                                            borderRadius: '50%',
                                            width: '40px',
                                            height: '40px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold',
                                            fontSize: '1.1rem',
                                            flexShrink: 0
                                        }}>
                                            {index + 1}
                                        </div>

                                        {/* Avatar */}
                                        <img 
                                            src={user.avatar} 
                                            alt={user.name}
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '50%',
                                                flexShrink: 0
                                            }}
                                        />

                                        {/* User Info */}
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ 
                                                color: colors.text, 
                                                fontSize: '1.1rem', 
                                                marginBottom: '5px',
                                                fontWeight: '600'
                                            }}>
                                                {user.name}
                                            </h3>
                                            <p style={{ 
                                                color: colors.textSecondary, 
                                                fontSize: '0.9rem',
                                                marginBottom: '5px'
                                            }}>
                                                @{user.username}
                                            </p>
                                            <div style={{ 
                                                display: 'flex', 
                                                gap: '15px',
                                                fontSize: '0.8rem'
                                            }}>
                                                <span style={{ color: colors.textSecondary }}>
                                                    👥 {user.followers} seguidores
                                                </span>
                                                <span style={{ color: colors.textSecondary }}>
                                                    📋 {user.lists} listas
                                                </span>
                                            </div>
                                        </div>

                                        {/* Trophy for top 3 */}
                                        {index < 3 && (
                                            <div style={{ fontSize: '1.5rem' }}>
                                                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Additional Stats */}
                <section style={{ marginTop: '40px' }}>
                    <h2 style={{ 
                        color: colors.text, 
                        fontSize: '2rem', 
                        marginBottom: '20px',
                        borderBottom: `2px solid ${colors.border}`,
                        paddingBottom: '10px'
                    }}>
                        📊 Estatísticas Gerais
                    </h2>
                    
                    <div style={{ 
                        display: 'grid', 
                        gap: '20px',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
                    }}>
                        <div style={{
                            background: colors.surface,
                            borderRadius: '12px',
                            padding: '20px',
                            border: `1px solid ${colors.border}`,
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🎬</div>
                            <div style={{ 
                                color: colors.text, 
                                fontSize: '1.5rem', 
                                fontWeight: 'bold',
                                marginBottom: '5px'
                            }}>
                                {rankings.mostWatched.length}
                            </div>
                            <div style={{ color: colors.textSecondary }}>Filmes Populares</div>
                        </div>

                        <div style={{
                            background: colors.surface,
                            borderRadius: '12px',
                            padding: '20px',
                            border: `1px solid ${colors.border}`,
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>👥</div>
                            <div style={{ 
                                color: colors.text, 
                                fontSize: '1.5rem', 
                                fontWeight: 'bold',
                                marginBottom: '5px'
                            }}>
                                {rankings.topUsers.length}
                            </div>
                            <div style={{ color: colors.textSecondary }}>Usuários Ativos</div>
                        </div>

                        <div style={{
                            background: colors.surface,
                            borderRadius: '12px',
                            padding: '20px',
                            border: `1px solid ${colors.border}`,
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📈</div>
                            <div style={{ 
                                color: colors.text, 
                                fontSize: '1.5rem', 
                                fontWeight: 'bold',
                                marginBottom: '5px'
                            }}>
                                {rankings.mostWatched.reduce((sum, show) => sum + show.watchCount, 0)}
                            </div>
                            <div style={{ color: colors.textSecondary }}>Total de Visualizações</div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Rankings;

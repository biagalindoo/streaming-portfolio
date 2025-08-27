// src/components/MovieCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import AddToListButton from './AddToListButton';

const MovieCard = ({ id, title, posterUrl, year, duration, videoUrl, rating }) => {
    const { colors } = useTheme();
    const { user } = useAuth();
    const handleWatch = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (videoUrl) {
            window.open(videoUrl, '_blank');
        } else {
            alert(`🎬 Assistindo: ${title}`);
        }
    };

    return (
        <Link 
            to={user ? `/movies/${id}` : '#'} 
            onClick={!user ? (e) => e.preventDefault() : undefined}
            style={{ 
                textDecoration: 'none',
                color: colors.text,
                transition: 'all 0.3s ease',
                display: 'block',
                height: '100%',
                cursor: user ? 'pointer' : 'default',
                opacity: user ? 1 : 0.7,
                ':hover': {
                    transform: user ? 'scale(1.02)' : 'none',
                    boxShadow: user ? `0 20px 40px ${colors.overlay}` : 'none'
                }
            }}
        >
            <div 
                className="movie-card"
                style={{ 
                    position: 'relative',
                    height: '100%',
                    overflow: 'hidden'
                }}
            >
                {/* Poster */}
                {posterUrl ? (
                    <img 
                        src={posterUrl} 
                        alt={title} 
                        style={{ 
                            width: '100%', 
                            height: 400, 
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease'
                        }} 
                    />
                ) : (
                    <div style={{ 
                        height: 400, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.surfaceHover} 100%)`,
                        color: colors.textSecondary,
                        fontSize: '1rem'
                    }}>
                        Sem imagem
                    </div>
                )}

                {/* Overlay on Hover */}
                <div 
                    className="overlay"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(180deg, transparent 0%, ${colors.overlay} 100%)`,
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: '20px'
                    }}
                >
                    {!user && (
                        <div style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'rgba(255, 0, 0, 0.8)',
                            color: 'white',
                            padding: '5px 10px',
                            borderRadius: '15px',
                            fontSize: '0.8rem',
                            fontWeight: '600'
                        }}>
                            🔒 Faça login
                        </div>
                    )}
                    <div>
                        <div style={{ 
                            fontSize: '1.1rem', 
                            fontWeight: 600, 
                            marginBottom: '8px',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                        }}>
                            {title}
                        </div>
                        <div style={{ 
                            fontSize: '0.9rem', 
                            color: colors.textSecondary,
                            textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                        }}>
                            {year || '2024'} • {duration || '2h 15min'}
                        </div>
                    </div>
                </div>

                {/* Play Button on Hover */}
                <button
                    className="play-button"
                    onClick={handleWatch}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: `${colors.primary}dd`,
                        color: '#000',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        backdropFilter: 'blur(10px)',
                        border: 'none',
                        cursor: 'pointer',
                        zIndex: 10
                    }}
                >
                    ▶
                </button>

                {/* Add to List Button */}
                <AddToListButton itemId={id} itemTitle={title} />

                {/* Info at Bottom */}
                <div style={{ 
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                                            background: `linear-gradient(180deg, transparent 0%, ${colors.overlay} 100%)`,
                    padding: '20px',
                    color: 'white'
                }}>
                    <div style={{ 
                        fontSize: '1rem', 
                        fontWeight: 600, 
                        marginBottom: '4px',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}>
                        {title}
                    </div>
                    <div style={{ 
                        fontSize: '0.85rem', 
                        color: '#ffffff',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}>
                        {year || '2024'} • {duration || '2h 15min'}
                        {rating && (
                            <span style={{ marginLeft: '8px', color: '#ffd700' }}>
                                ★ {rating.toFixed(1)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;



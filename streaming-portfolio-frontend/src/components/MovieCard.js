// src/components/MovieCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ id, title, posterUrl, year }) => {
    return (
        <Link to={`/movies/${id}`} style={{ 
            background: 'rgba(255,255,255,0.03)', 
            border: '1px solid rgba(255,255,255,0.08)', 
            borderRadius: 12, 
            overflow: 'hidden', 
            textDecoration: 'none',
            color: 'white',
            transition: 'all 0.3s ease'
        }}>
            {posterUrl ? (
                <img src={posterUrl} alt={title} style={{ width: '100%', height: 300, objectFit: 'cover' }} />
            ) : (
                <div style={{ 
                    height: 300, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    background: '#0c1222',
                    color: '#8b93a7'
                }}>
                    Sem imagem
                </div>
            )}
            <div style={{ padding: 16 }}>
                <div style={{ fontSize: 15, marginBottom: 8, fontWeight: 600 }}>{title}</div>
                <div style={{ fontSize: 13, color: '#8b93a7' }}>{year || '—'}</div>
            </div>
        </Link>
    );
};

export default MovieCard;



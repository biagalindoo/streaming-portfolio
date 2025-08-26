// src/components/MovieCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ id, title, posterUrl, year }) => {
    return (
        <Link to={`/movies/${id}`} className="card">
            {posterUrl ? (
                <img src={posterUrl} alt={title} />
            ) : (
                <div style={{ height: 270, display: 'grid', placeItems: 'center', background: '#0c1222' }}>
                    <span className="card-meta">Sem imagem</span>
                </div>
            )}
            <div className="card-body">
                <div className="card-title">{title}</div>
                <div className="card-meta">{year || '—'}</div>
            </div>
        </Link>
    );
};

export default MovieCard;



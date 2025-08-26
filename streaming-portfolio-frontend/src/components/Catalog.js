// src/components/Catalog.js
import React, { useEffect, useMemo, useState } from 'react';
import MovieCard from './MovieCard';

const Catalog = () => {
    const [series, setSeries] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');

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

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>Erro: {error}</p>;

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return series;
        return series.filter(s => `${s.title} ${s.year || ''}`.toLowerCase().includes(q));
    }, [series, query]);

    return (
        <div>
            <h1>Explorar</h1>
            <div className="searchbar">
                <input
                    type="text"
                    placeholder="Buscar por título..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="input"
                />
            </div>
            <div className="grid">
                {filtered.map((item) => (
                    <MovieCard key={item.id} id={item.id} title={item.title} posterUrl={item.posterUrl} year={item.year} />
                ))}
            </div>
        </div>
    );
};

export default Catalog;

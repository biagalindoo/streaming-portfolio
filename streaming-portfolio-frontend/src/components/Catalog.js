// src/components/Catalog.js
import React, { useEffect, useMemo, useState } from 'react';
import MovieCard from './MovieCard';

const FAV_KEY = 'favorites';

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

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return series;
        return series.filter(s => `${s.title} ${s.year || ''}`.toLowerCase().includes(q));
    }, [series, query]);

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>Erro: {error}</p>;

    const toggleFav = (item) => {
        try {
            const raw = localStorage.getItem(FAV_KEY);
            const list = raw ? JSON.parse(raw) : [];
            const exists = list.find((f) => f.id === item.id);
            const next = exists ? list.filter((f) => f.id !== item.id) : [...list, item];
            localStorage.setItem(FAV_KEY, JSON.stringify(next));
        } catch {}
    };

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
                    <div key={item.id}>
                        <MovieCard id={item.id} title={item.title} posterUrl={item.posterUrl} year={item.year} />
                        <button className="button" style={{ width: '100%', marginTop: 8 }} onClick={() => toggleFav(item)}>Favoritar</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Catalog;

// src/components/Catalog.js
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard';
import { useToast } from './Toast';
import { AuthContext } from '../context/AuthContext';

const FAV_KEY = 'favorites';

const Catalog = () => {
    const [series, setSeries] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

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
        const params = new URLSearchParams(location.search);
        const type = params.get('type');
        let base = series;
        if (type === 'show' || type === 'movie') {
            base = base.filter(s => s.type === type);
        }
        if (!q) return base;
        return base.filter(s => `${s.title} ${s.year || ''}`.toLowerCase().includes(q));
    }, [series, query, location.search]);

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>Erro: {error}</p>;

    const toast = useToast();
    const { authHeaders } = useContext(AuthContext);
    const toggleFav = async (item) => {
        try {
            // Try add; if conflict semantics needed we'd query first, here we toggle by attempting delete on failure
            const addRes = await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...authHeaders() },
                body: JSON.stringify({ itemId: item.id }),
            });
            if (addRes.ok) {
                toast.success('Adicionado aos favoritos!');
                return;
            }
            // if already exists or other, try delete
            const delRes = await fetch(`/api/favorites/${item.id}`, {
                method: 'DELETE',
                headers: { ...authHeaders() },
            });
            if (delRes.ok || delRes.status === 204) {
                toast.success('Removido dos favoritos');
                return;
            }
            const err = await addRes.json().catch(() => ({}));
            throw new Error(err.error || 'Não foi possível atualizar favoritos');
        } catch (e) {
            toast.error(e.message || 'Erro ao atualizar favoritos');
        }
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
                <select className="input" value={new URLSearchParams(location.search).get('type') || ''} onChange={(e) => {
                    const v = e.target.value;
                    const params = new URLSearchParams(location.search);
                    if (v) params.set('type', v); else params.delete('type');
                    navigate({ search: params.toString() });
                }}>
                    <option value="">Todos</option>
                    <option value="show">Séries</option>
                    <option value="movie">Filmes</option>
                </select>
            </div>
            <div className="grid">
                {filtered.map((item) => (
                    <div key={item.id} style={{ position: 'relative' }}>
                        <MovieCard id={item.id} title={item.title} posterUrl={item.coverUrl} year={item.year} />
                        {user && (
                            <button className="button" style={{ width: '100%', marginTop: 8 }} onClick={() => toggleFav(item)}>
                                Favoritar
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Catalog;

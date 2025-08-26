// src/components/UserPage.js
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from './Toast';

const FAV_KEY = 'favorites';

const UserPage = () => {
    const { user, authHeaders } = useContext(AuthContext);
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
        <div>
            <h1>Olá, {user?.email}</h1>
            <h2>Favoritos</h2>
            {loading && <p>Carregando...</p>}
            {error && <p>Erro: {error}</p>}
            {!loading && !error && favoriteIds.length === 0 && <p>Você ainda não adicionou favoritos.</p>}
            {!loading && !error && favoriteIds.length > 0 && (
                <ul>
                    {favoriteIds.map((id) => (
                        <li key={id}>{id}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserPage;



// src/components/UserPage.js
import React, { useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';

const FAV_KEY = 'favorites';

const UserPage = () => {
    const { user } = useContext(AuthContext);
    const favorites = useMemo(() => {
        try {
            const raw = localStorage.getItem(FAV_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }, []);

    return (
        <div>
            <h1>Olá, {user?.email}</h1>
            <h2>Favoritos</h2>
            {favorites.length === 0 ? (
                <p>Você ainda não adicionou favoritos.</p>
            ) : (
                <ul>
                    {favorites.map((f) => (
                        <li key={f.id}>{f.title} {f.year ? `(${f.year})` : ''}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserPage;



// src/context/AuthContext.js
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

export const AuthContext = createContext({
    user: null,
    token: null,
    login: async () => {},
    signup: async () => {},
    logout: () => {},
});

const STORAGE_KEY = 'auth';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                setUser(parsed.user || null);
                setToken(parsed.token || null);
            }
        } catch {}
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
    }, [user, token]);

    const login = useCallback(async ({ email, password }) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Falha no login');
        setToken(data.token);
        setUser(data.user || { email });
        return data;
    }, []);

    const signup = useCallback(async ({ name, email, password }) => {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Falha no cadastro');
        return data;
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    const value = useMemo(() => ({ user, token, login, signup, logout }), [user, token, login, signup, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};



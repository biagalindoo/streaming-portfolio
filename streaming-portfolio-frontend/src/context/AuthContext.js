// src/context/AuthContext.js
import React, { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react';

export const AuthContext = createContext({
    user: null,
    token: null,
    currentProfile: null,
    authHeaders: () => ({}),
    login: async () => {},
    signup: async () => {},
    logout: () => {},
    setCurrentProfile: () => {},
});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const STORAGE_KEY = 'auth';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [currentProfile, setCurrentProfile] = useState(null);

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

    const authHeaders = useCallback(() => {
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, [token]);

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
        // Reset current profile to show profile selector
        setCurrentProfile(null);
        return data;
    }, [setCurrentProfile]);

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
        setCurrentProfile(null);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    const value = useMemo(() => ({ 
        user, 
        token, 
        currentProfile, 
        authHeaders, 
        login, 
        signup, 
        logout, 
        setCurrentProfile 
    }), [user, token, currentProfile, authHeaders, login, signup, logout, setCurrentProfile]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};



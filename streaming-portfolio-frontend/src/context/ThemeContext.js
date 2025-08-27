import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true; // Default to dark theme
    });

    useEffect(() => {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    const theme = {
        isDark,
        toggleTheme,
        colors: isDark ? {
            // Dark theme colors
            primary: '#00d4ff',
            secondary: '#6c5ce7',
            background: '#0a0a0a',
            surface: '#1a1a1a',
            surfaceHover: '#2a2a2a',
            text: '#ffffff',
            textSecondary: '#8b93a7',
            border: 'rgba(255,255,255,0.1)',
            borderHover: 'rgba(255,255,255,0.2)',
            success: '#00b894',
            error: '#ff6b6b',
            warning: '#fdcb6e',
            overlay: 'rgba(0,0,0,0.8)',
            gradient: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)',
            cardBackground: 'rgba(255,255,255,0.03)',
            cardHover: 'rgba(255,255,255,0.08)',
            backdrop: 'rgba(255,255,255,0.05)',
            backdropBlur: 'blur(10px)'
        } : {
            // Light theme colors
            primary: '#00d4ff',
            secondary: '#6c5ce7',
            background: '#f8f9fa',
            surface: '#ffffff',
            surfaceHover: '#f1f3f4',
            text: '#1a1a1a',
            textSecondary: '#5f6368',
            border: 'rgba(0,0,0,0.1)',
            borderHover: 'rgba(0,0,0,0.2)',
            success: '#00b894',
            error: '#ff6b6b',
            warning: '#fdcb6e',
            overlay: 'rgba(0,0,0,0.9)',
            gradient: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 100%)',
            cardBackground: 'rgba(0,0,0,0.02)',
            cardHover: 'rgba(0,0,0,0.05)',
            backdrop: 'rgba(0,0,0,0.03)',
            backdropBlur: 'blur(10px)'
        }
    };

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};

// src/components/Login.js
import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(AuthContext);
    const { colors } = useTheme();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        login({ email, password })
            .then(() => {
                const from = location.state?.from?.pathname || '/user';
                navigate(from, { replace: true });
            })
            .catch(err => setError(err.message));
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '80vh',
            padding: '20px'
        }}>
            <form onSubmit={handleSubmit} style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: '16px',
                padding: '40px',
                width: '100%',
                maxWidth: '400px',
                boxShadow: `0 10px 30px ${colors.overlay}`,
                backdropFilter: colors.backdropBlur
            }}>
                <h1 style={{ 
                    color: colors.text, 
                    textAlign: 'center', 
                    marginBottom: '32px',
                    fontSize: '2rem',
                    fontWeight: 700
                }}>
                    Entrar
                </h1>
                
                {error && (
                    <div style={{
                        background: colors.error + '20',
                        border: `1px solid ${colors.error}`,
                        color: colors.error,
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        fontSize: '0.9rem'
                    }}>
                        Erro: {error}
                    </div>
                )}
                
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                    style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: `1px solid ${colors.border}`,
                        borderRadius: '8px',
                        background: colors.cardBackground,
                        color: colors.text,
                        fontSize: '1rem',
                        marginBottom: '16px',
                        boxSizing: 'border-box'
                    }}
                />
                
            <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                    style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: `1px solid ${colors.border}`,
                        borderRadius: '8px',
                        background: colors.cardBackground,
                        color: colors.text,
                        fontSize: '1rem',
                        marginBottom: '24px',
                        boxSizing: 'border-box'
                    }}
                />
                
                <button type="submit" style={{
                    width: '100%',
                    padding: '14px',
                    background: colors.primary,
                    color: '#000',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginBottom: '20px',
                    transition: 'all 0.2s ease'
                }}>
                    Entrar
                </button>
                
                <div style={{ 
                    textAlign: 'center', 
                    color: colors.textSecondary,
                    fontSize: '0.9rem'
                }}>
                    Não tem conta?{' '}
                    <Link to="/signup" style={{
                        color: colors.primary,
                        textDecoration: 'none',
                        fontWeight: 600
                    }}>
                        Cadastre-se
                    </Link>
                </div>
        </form>
        </div>
    );
};

export default Login;

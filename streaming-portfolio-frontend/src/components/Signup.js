// src/components/Signup.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { colors } = useTheme();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (password !== confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        })
            .then(async (response) => {
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Falha no cadastro');
                return data;
            })
            .then((data) => {
                setSuccess('Cadastro realizado com sucesso! Faça login.');
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            })
            .catch((err) => setError(err.message));
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
                    Cadastro
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
                
                {success && (
                    <div style={{
                        background: colors.success + '20',
                        border: `1px solid ${colors.success}`,
                        color: colors.success,
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        fontSize: '0.9rem'
                    }}>
                        {success}
                    </div>
                )}
                
                <input
                    type="text"
                    placeholder="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                        marginBottom: '16px',
                        boxSizing: 'border-box'
                    }}
                />
                
                <input
                    type="password"
                    placeholder="Confirmar Senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    Criar conta
                </button>
                
                <div style={{ 
                    textAlign: 'center', 
                    color: colors.textSecondary,
                    fontSize: '0.9rem'
                }}>
                    Já tem conta?{' '}
                    <Link to="/login" style={{
                        color: colors.primary,
                        textDecoration: 'none',
                        fontWeight: 600
                    }}>
                        Faça login
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Signup;



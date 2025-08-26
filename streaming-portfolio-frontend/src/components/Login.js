// src/components/Login.js
import React, { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
        .then(async response => {
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Falha no login');
            return data;
        })
        .then(data => {
            console.log('Login bem-sucedido', data);
            localStorage.setItem('token', data.token);
        })
        .catch(err => setError(err.message));
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Entrar</button>
        </form>
    );
};

export default Login;

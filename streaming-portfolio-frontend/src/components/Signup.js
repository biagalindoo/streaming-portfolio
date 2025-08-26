// src/components/Signup.js
import React, { useState } from 'react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

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
        <form onSubmit={handleSubmit}>
            <h1>Cadastro</h1>
            {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <input
                type="text"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
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
            <input
                type="password"
                placeholder="Confirmar Senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />
            <button type="submit">Criar conta</button>
        </form>
    );
};

export default Signup;



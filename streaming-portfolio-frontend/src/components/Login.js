// src/components/Login.js
import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(AuthContext);

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
        <form onSubmit={handleSubmit} className="auth-form">
            <h1>Entrar</h1>
            {error && <p className="error">Erro: {error}</p>}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
            />
            <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input"
            />
            <button type="submit" className="button">Entrar</button>
            <div className="meta">Não tem conta? <Link to="/signup">Cadastre-se</Link></div>
        </form>
    );
};

export default Login;

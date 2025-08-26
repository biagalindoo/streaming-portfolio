// src/components/Layout.js
import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid #eee' }}>
                <nav style={{ display: 'flex', gap: 12 }}>
                    <Link to="/">Início</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Cadastro</Link>
                </nav>
            </header>
            <main style={{ padding: 20 }}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;



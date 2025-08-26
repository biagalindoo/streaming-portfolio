// src/components/Layout.js
import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div>
            <header className="header">
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/" className="brand">
                        <span className="brand-dot" />
                        Streaming<span style={{ color: 'var(--accent)' }}>Portfolio</span>
                    </Link>
                    <nav className="nav">
                        <NavLink to="/" end>Início</NavLink>
                        <NavLink to="/login">Login</NavLink>
                        <NavLink to="/signup">Cadastro</NavLink>
                    </nav>
                </div>
            </header>
            <main className="container" style={{ paddingTop: 24 }}>
                <Outlet />
            </main>
            <footer className="footer">
                <div className="container">© {new Date().getFullYear()} Streaming Portfolio</div>
            </footer>
        </div>
    );
};

export default Layout;



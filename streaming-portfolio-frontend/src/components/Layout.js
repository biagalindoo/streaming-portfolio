// src/components/Layout.js
import React, { useContext } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Layout = () => {
    const { user, logout } = useContext(AuthContext);
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh' }}>
            <aside style={{ background: '#0b1020', borderRight: '1px solid #19223a' }}>
                <div className="container" style={{ padding: 20 }}>
                    <Link to="/" className="brand" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="brand-dot" />
                        <span>Streaming<span style={{ color: 'var(--accent)' }}>Portfolio</span></span>
                    </Link>
                    <nav className="nav" style={{ display: 'grid', marginTop: 20, gap: 8 }}>
                        <NavLink to="/" end>Início</NavLink>
                        <NavLink to="/?type=show">Séries</NavLink>
                        <NavLink to="/?type=movie">Filmes</NavLink>
                        <NavLink to="/my-list">Minha lista</NavLink>
                    </nav>
                </div>
            </aside>
            <div>
            <header className="header" style={{ borderBottom: '1px solid #19223a' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px' }}>
                    <div />
                    {user && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <NavLink to="/user" style={{ 
                                width: 40, 
                                height: 40, 
                                borderRadius: '50%', 
                                background: 'var(--primary)', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                fontSize: 16,
                                fontWeight: 600
                            }}>
                                {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                            </NavLink>
                            <button 
                                onClick={logout}
                                style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    color: 'var(--muted)', 
                                    cursor: 'pointer',
                                    fontSize: 14
                                }}
                            >
                                Sair
                            </button>
                        </div>
                    )}
                </div>
            </header>
            <main className="container" style={{ paddingTop: 24 }}>
                <Outlet />
            </main>
            <footer className="footer">
                <div className="container">© {new Date().getFullYear()} Streaming Portfolio</div>
            </footer>
            </div>
        </div>
    );
};

export default Layout;



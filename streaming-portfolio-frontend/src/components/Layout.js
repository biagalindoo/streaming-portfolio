// src/components/Layout.js
import React, { useContext } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Layout = () => {
    const { user, logout } = useContext(AuthContext);
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 220px', minHeight: '100vh' }}>
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
                        {user ? (
                            <>
                                <NavLink to="/user">Minha conta</NavLink>
                                <a href="#" onClick={(e) => { e.preventDefault(); logout(); }}>Sair</a>
                            </>
                        ) : (
                            <>
                                <NavLink to="/login">Login</NavLink>
                                <NavLink to="/signup">Cadastro</NavLink>
                            </>
                        )}
                    </nav>
                </div>
            </aside>
            <div>
            <header className="header" style={{ borderBottom: '1px solid #19223a' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div />
                </div>
            </header>
            <main className="container" style={{ paddingTop: 24 }}>
                <Outlet />
            </main>
            <footer className="footer">
                <div className="container">© {new Date().getFullYear()} Streaming Portfolio</div>
            </footer>
            </div>
            <aside style={{ background: '#0b1020', borderLeft: '1px solid #19223a' }}>
                <div className="container" style={{ padding: 20, display: 'grid', gap: 10 }}>
                    {user ? (
                        <>
                            <div style={{ color: 'var(--muted)' }}>Logado como</div>
                            <div style={{ fontWeight: 600 }}>{user.name || user.email}</div>
                            <NavLink to="/user">Minha conta</NavLink>
                            <a href="#" onClick={(e) => { e.preventDefault(); logout(); }}>Sair</a>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login">Login</NavLink>
                            <NavLink to="/signup">Cadastro</NavLink>
                        </>
                    )}
                </div>
            </aside>
        </div>
    );
};

export default Layout;



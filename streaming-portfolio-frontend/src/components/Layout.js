// src/components/Layout.js
import React, { useContext } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Layout = () => {
    const { user, logout } = useContext(AuthContext);
    
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0b0f19' }}>
            <aside style={{ width: '240px', background: '#0b1020', borderRight: '1px solid #19223a' }}>
                <div style={{ padding: 20 }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'white', textDecoration: 'none' }}>
                        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#00d4ff' }} />
                        <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>
                            Streaming<span style={{ color: '#00d4ff' }}>Portfolio</span>
                        </span>
                    </Link>
                    <nav style={{ display: 'flex', flexDirection: 'column', marginTop: 20, gap: 8 }}>
                        <NavLink to="/" end style={{ color: '#8b93a7', padding: '8px 12px', borderRadius: 8, textDecoration: 'none' }}>Início</NavLink>
                        <NavLink to="/?type=show" style={{ color: '#8b93a7', padding: '8px 12px', borderRadius: 8, textDecoration: 'none' }}>Séries</NavLink>
                        <NavLink to="/?type=movie" style={{ color: '#8b93a7', padding: '8px 12px', borderRadius: 8, textDecoration: 'none' }}>Filmes</NavLink>
                        <NavLink to="/my-list" style={{ color: '#8b93a7', padding: '8px 12px', borderRadius: 8, textDecoration: 'none' }}>Minha lista</NavLink>
                    </nav>
                </div>
            </aside>
            <div style={{ flex: 1 }}>
                <header style={{ background: 'rgba(17, 23, 38, 0.95)', borderBottom: '1px solid #19223a', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div />
                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <NavLink to="/user" style={{ 
                                    width: 40, 
                                    height: 40, 
                                    borderRadius: '50%', 
                                    background: '#6c5ce7', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    fontSize: 16,
                                    fontWeight: 600,
                                    color: 'white',
                                    textDecoration: 'none'
                                }}>
                                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                                </NavLink>
                                <button 
                                    onClick={logout}
                                    style={{ 
                                        background: 'none', 
                                        border: 'none', 
                                        color: '#8b93a7', 
                                        cursor: 'pointer',
                                        fontSize: 14
                                    }}
                                >
                                    Sair
                                </button>
                            </div>
                        ) : (
                            <NavLink to="/login" style={{ 
                                color: '#8b93a7', 
                                textDecoration: 'none',
                                fontSize: 14,
                                padding: '8px 16px',
                                borderRadius: 8,
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                Login
                            </NavLink>
                        )}
                    </div>
                </header>
                <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
                    <Outlet />
                </main>
                <footer style={{ marginTop: 60, padding: '30px 0', color: '#8b93a7', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                    © {new Date().getFullYear()} Streaming Portfolio
                </footer>
            </div>
        </div>
    );
};

export default Layout;



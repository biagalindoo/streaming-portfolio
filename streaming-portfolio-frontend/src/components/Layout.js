// src/components/Layout.js
import React, { useContext } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Layout = () => {
    const { user, logout } = useContext(AuthContext);
    const { isDark, toggleTheme, colors } = useTheme();
    
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: colors.background }}>
            <aside style={{ width: '240px', background: colors.surface, borderRight: `1px solid ${colors.border}` }}>
                <div style={{ padding: 20 }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: colors.text, textDecoration: 'none' }}>
                        <span style={{ width: 12, height: 12, borderRadius: '50%', background: colors.primary }} />
                        <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>
                            Streaming<span style={{ color: colors.primary }}>Portfolio</span>
                        </span>
                    </Link>
                    <nav style={{ display: 'flex', flexDirection: 'column', marginTop: 20, gap: 8 }}>
                        <NavLink to="/" end style={{ color: colors.textSecondary, padding: '8px 12px', borderRadius: 8, textDecoration: 'none' }}>Início</NavLink>
                        <NavLink to="/?type=show" style={{ color: colors.textSecondary, padding: '8px 12px', borderRadius: 8, textDecoration: 'none' }}>Séries</NavLink>
                        <NavLink to="/?type=movie" style={{ color: colors.textSecondary, padding: '8px 12px', borderRadius: 8, textDecoration: 'none' }}>Filmes</NavLink>
                        <NavLink to="/my-list" style={{ color: colors.textSecondary, padding: '8px 12px', borderRadius: 8, textDecoration: 'none' }}>Minha lista</NavLink>
                        <NavLink to="/recommendations" style={{ color: colors.textSecondary, padding: '8px 12px', borderRadius: 8, textDecoration: 'none' }}>Recomendações</NavLink>
                    </nav>
                </div>
            </aside>
            <div style={{ flex: 1 }}>
                <header style={{ background: colors.surface, borderBottom: `1px solid ${colors.border}`, padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            {/* Theme Toggle Button */}
                            <button 
                                onClick={toggleTheme}
                                style={{ 
                                    background: colors.cardBackground,
                                    border: `1px solid ${colors.border}`,
                                    color: colors.text,
                                    cursor: 'pointer',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.2s ease'
                                }}
                                title={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
                            >
                                {isDark ? '☀️' : '🌙'} {isDark ? 'Claro' : 'Escuro'}
                            </button>
                            

                            
                            {user ? (
                                <>
                                    <NavLink to="/user" style={{ 
                                        width: 40, 
                                        height: 40, 
                                        borderRadius: '50%', 
                                        background: colors.secondary, 
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
                                            color: colors.textSecondary, 
                                            cursor: 'pointer',
                                            fontSize: 14
                                        }}
                                    >
                                        Sair
                                    </button>
                                </>
                            ) : (
                                <NavLink to="/login" style={{ 
                                    color: colors.textSecondary, 
                                    textDecoration: 'none',
                                    fontSize: 14,
                                    padding: '8px 16px',
                                    borderRadius: 8,
                                    border: `1px solid ${colors.border}`
                                }}>
                                    Login
                                </NavLink>
                            )}
                        </div>
                    </div>
                </header>
                <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
                    <Outlet />
                </main>
                <footer style={{ marginTop: 60, padding: '30px 0', color: colors.textSecondary, borderTop: `1px solid ${colors.border}`, textAlign: 'center' }}>
                    © {new Date().getFullYear()} Streaming Portfolio
                </footer>
            </div>
        </div>
    );
};

export default Layout;



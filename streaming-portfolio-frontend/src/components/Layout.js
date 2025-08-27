// src/components/Layout.js
import React, { useContext } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ProfileSelector from './ProfileSelector';

const Layout = () => {
    const { user, logout, currentProfile, setCurrentProfile, token } = useContext(AuthContext);
    const { isDark, toggleTheme, colors } = useTheme();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [profiles, setProfiles] = useState([]);
    
    // Se está logado mas não tem perfil ativo, mostra seletor de perfil
    if (user && !currentProfile) {
        return <ProfileSelector />;
    }
    
    // Carregar perfis quando o usuário está logado
    useEffect(() => {
        if (user && token) {
            fetchProfiles();
        }
    }, [user, token]);
    
    const fetchProfiles = async () => {
        try {
            const response = await fetch('/api/parental/profiles', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setProfiles(data);
            }
        } catch (err) {
            console.error('Error fetching profiles:', err);
        }
    };
    
    const handleSwitchProfile = async (profile) => {
        try {
            const response = await fetch(`/api/parental/profiles/${profile.id}/switch`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                setCurrentProfile(profile);
                setShowProfileMenu(false);
            } else {
                throw new Error('Erro ao trocar perfil');
            }
        } catch (err) {
            console.error('Error switching profile:', err);
        }
    };
    
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
                        
                                                  {/* Social Features */}
                          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: `1px solid ${colors.border}` }}>
                              <div style={{ color: colors.textSecondary, fontSize: '0.8rem', fontWeight: '600', marginBottom: '10px', textTransform: 'uppercase' }}>
                                  Social
                              </div>
                              <NavLink to="/rankings" style={{ color: colors.textSecondary, padding: '8px 12px', borderRadius: 8, textDecoration: 'none' }}>🏆 Rankings</NavLink>
                              <br />
                              <NavLink to="/lists" style={{ color: colors.textSecondary, padding: '8px 12px', borderRadius: 8, textDecoration: 'none' }}>📋 Listas Públicas</NavLink>
                              <br />
                              <NavLink to="/parental" style={{ color: colors.textSecondary, padding: '8px 12px', borderRadius: 8, textDecoration: 'none' }}>🔒 Controle Parental</NavLink>
                          </div>
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
                                                                         <div style={{ position: 'relative' }}>
                                        <button 
                                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                                            style={{ 
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
                                                border: 'none',
                                                cursor: 'pointer',
                                                position: 'relative'
                                            }}
                                        >
                                            {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                                            {currentProfile && (
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: -2,
                                                    right: -2,
                                                    width: 16,
                                                    height: 16,
                                                    borderRadius: '50%',
                                                    background: currentProfile.isChild ? '#ff6b6b' : colors.primary,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '10px',
                                                    border: `2px solid ${colors.background}`
                                                }}>
                                                    {currentProfile.avatar}
                                                </div>
                                            )}
                                        </button>
                                        
                                        {/* Profile Menu Dropdown */}
                                        {showProfileMenu && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '100%',
                                                right: 0,
                                                marginTop: '8px',
                                                background: colors.surface,
                                                border: `1px solid ${colors.border}`,
                                                borderRadius: '12px',
                                                padding: '12px',
                                                minWidth: '200px',
                                                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                                zIndex: 1000
                                            }}>
                                                <div style={{
                                                    color: colors.textSecondary,
                                                    fontSize: '0.8rem',
                                                    fontWeight: '600',
                                                    marginBottom: '8px',
                                                    padding: '0 8px'
                                                }}>
                                                    PERFIS
                                                </div>
                                                {profiles.map(profile => (
                                                    <button
                                                        key={profile.id}
                                                        onClick={() => handleSwitchProfile(profile)}
                                                        style={{
                                                            width: '100%',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '12px',
                                                            padding: '8px 12px',
                                                            background: 'transparent',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            color: colors.text,
                                                            fontSize: '0.9rem',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.target.style.background = colors.cardBackground;
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.target.style.background = 'transparent';
                                                        }}
                                                    >
                                                        <div style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            borderRadius: '50%',
                                                            background: profile.isChild ? '#ff6b6b' : colors.primary,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '1.2rem'
                                                        }}>
                                                            {profile.avatar}
                                                        </div>
                                                        <div style={{ textAlign: 'left' }}>
                                                            <div style={{ fontWeight: '600' }}>
                                                                {profile.name}
                                                            </div>
                                                            <div style={{ 
                                                                fontSize: '0.8rem', 
                                                                color: colors.textSecondary 
                                                            }}>
                                                                {profile.age} anos
                                                                {profile.isChild && ' • Infantil'}
                                                            </div>
                                                        </div>
                                                        {currentProfile?.id === profile.id && (
                                                            <div style={{
                                                                marginLeft: 'auto',
                                                                color: colors.primary,
                                                                fontSize: '1.2rem'
                                                            }}>
                                                                ✓
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                                <div style={{
                                                    borderTop: `1px solid ${colors.border}`,
                                                    marginTop: '8px',
                                                    paddingTop: '8px'
                                                }}>
                                                    <NavLink 
                                                        to="/user"
                                                        style={{
                                                            width: '100%',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '12px',
                                                            padding: '8px 12px',
                                                            background: 'transparent',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            color: colors.text,
                                                            fontSize: '0.9rem',
                                                            textDecoration: 'none',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.target.style.background = colors.cardBackground;
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.target.style.background = 'transparent';
                                                        }}
                                                    >
                                                        <div style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            borderRadius: '50%',
                                                            background: colors.secondary,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '1rem',
                                                            color: 'white'
                                                        }}>
                                                            ⚙️
                                                        </div>
                                                        Configurações
                                                    </NavLink>
                                                </div>
                                            </div>
                                        )}
                                    </div>
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



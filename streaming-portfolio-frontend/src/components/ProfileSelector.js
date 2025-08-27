import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from './Toast';
import './ProfileSelector.css';

const ProfileSelector = () => {
    const { user, token, setCurrentProfile } = useAuth();
    const { colors } = useTheme();
    const toast = useToast();
    const navigate = useNavigate();

    const [profiles, setProfiles] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newProfile, setNewProfile] = useState({
        name: '',
        age: 0,
        isChild: false,
        avatar: '',
        restrictions: {
            maxAgeRating: 'L',
            allowViolence: false,
            allowLanguage: false,
            allowAdultContent: false
        }
    });

    const defaultAvatars = [
        '👤', '👨', '👩', '👶', '👧', '👦', '👴', '👵', '🦸', '🦸‍♀️', '🧙', '🧙‍♀️', '🤖', '🐱', '🐶', '🐼'
    ];

    useEffect(() => {
        if (user) {
            fetchProfiles();
        }
    }, [user]);

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

    const handleCreateProfile = async () => {
        if (!newProfile.name.trim()) {
            toast.error('Nome do perfil é obrigatório');
            return;
        }

        if (!newProfile.avatar) {
            toast.error('Selecione um avatar');
            return;
        }

        try {
            const response = await fetch('/api/parental/profiles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newProfile)
            });

            if (response.ok) {
                const createdProfile = await response.json();
                setProfiles([...profiles, createdProfile]);
                setShowCreateModal(false);
                setNewProfile({
                    name: '',
                    age: 0,
                    isChild: false,
                    avatar: '',
                    restrictions: {
                        maxAgeRating: 'L',
                        allowViolence: false,
                        allowLanguage: false,
                        allowAdultContent: false
                    }
                });
                toast.success('Perfil criado com sucesso!');
            } else {
                throw new Error('Erro ao criar perfil');
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleSelectProfile = async (profile) => {
        try {
            const response = await fetch(`/api/parental/profiles/${profile.id}/switch`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setCurrentProfile(profile);
                toast.success(`Bem-vindo, ${profile.name}!`);
                navigate('/');
            } else {
                throw new Error('Erro ao selecionar perfil');
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleLogout = () => {
        // Logout logic will be handled by AuthContext
        navigate('/login');
    };

    if (!user) {
        return null;
    }

    return (
        <div className="profile-selector" style={{ 
            backgroundColor: colors.background, 
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{ 
                maxWidth: '800px', 
                width: '100%',
                textAlign: 'center'
            }}>
                {/* Header */}
                <div style={{ marginBottom: '60px' }}>
                    <h1 style={{ 
                        color: colors.text, 
                        fontSize: '3.5rem', 
                        marginBottom: '20px',
                        fontWeight: 'bold'
                    }}>
                        Quem está assistindo?
                    </h1>
                    <p style={{ 
                        color: colors.textSecondary, 
                        fontSize: '1.2rem' 
                    }}>
                        Escolha um perfil para continuar
                    </p>
                </div>

                {/* Profiles Grid */}
                <div style={{ 
                    display: 'grid', 
                    gap: '30px',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    maxWidth: '600px',
                    margin: '0 auto 60px auto'
                }}>
                    {profiles.map(profile => (
                        <div 
                            key={profile.id}
                            onClick={() => handleSelectProfile(profile)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '15px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                padding: '20px',
                                borderRadius: '12px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1)';
                            }}
                        >
                            <div style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                background: profile.isChild ? '#ff6b6b' : colors.primary,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '4rem',
                                border: `4px solid ${colors.border}`,
                                transition: 'all 0.3s ease'
                            }}>
                                {profile.avatar}
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <h3 style={{ 
                                    color: colors.text, 
                                    fontSize: '1.3rem', 
                                    marginBottom: '5px',
                                    fontWeight: '600'
                                }}>
                                    {profile.name}
                                </h3>
                                <p style={{ 
                                    color: colors.textSecondary, 
                                    fontSize: '0.9rem' 
                                }}>
                                    {profile.age} anos
                                </p>
                                {profile.isChild && (
                                    <span style={{ 
                                        background: '#ff6b6b',
                                        color: 'white',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        fontSize: '0.7rem',
                                        fontWeight: '600'
                                    }}>
                                        👶 Infantil
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Add Profile Button */}
                    <div 
                        onClick={() => setShowCreateModal(true)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '15px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            padding: '20px',
                            borderRadius: '12px',
                            border: `2px dashed ${colors.border}`
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.borderColor = colors.primary;
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.borderColor = colors.border;
                        }}
                    >
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            background: colors.surface,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3rem',
                            border: `4px solid ${colors.border}`,
                            color: colors.textSecondary
                        }}>
                            +
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ 
                                color: colors.textSecondary, 
                                fontSize: '1.3rem',
                                fontWeight: '600'
                            }}>
                                Adicionar Perfil
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    style={{
                        background: 'transparent',
                        border: `1px solid ${colors.border}`,
                        color: colors.textSecondary,
                        padding: '12px 30px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = colors.surface;
                        e.target.style.color = colors.text;
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = colors.textSecondary;
                    }}
                >
                    Sair
                </button>
            </div>

            {/* Create Profile Modal */}
            {showCreateModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: colors.surface,
                        borderRadius: '12px',
                        padding: '40px',
                        maxWidth: '500px',
                        width: '90%',
                        border: `1px solid ${colors.border}`
                    }}>
                        <h2 style={{ 
                            color: colors.text, 
                            fontSize: '2rem', 
                            marginBottom: '30px',
                            textAlign: 'center'
                        }}>
                            Criar Novo Perfil
                        </h2>
                        
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ 
                                color: colors.text, 
                                display: 'block', 
                                marginBottom: '10px',
                                fontSize: '1.1rem'
                            }}>
                                Nome do Perfil *
                            </label>
                            <input
                                type="text"
                                value={newProfile.name}
                                onChange={(e) => setNewProfile({...newProfile, name: e.target.value})}
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    border: `1px solid ${colors.border}`,
                                    background: colors.background,
                                    color: colors.text,
                                    fontSize: '1rem'
                                }}
                                placeholder="Ex: João"
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ 
                                color: colors.text, 
                                display: 'block', 
                                marginBottom: '10px',
                                fontSize: '1.1rem'
                            }}>
                                Idade
                            </label>
                            <input
                                type="number"
                                value={newProfile.age}
                                onChange={(e) => setNewProfile({...newProfile, age: parseInt(e.target.value) || 0})}
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    border: `1px solid ${colors.border}`,
                                    background: colors.background,
                                    color: colors.text,
                                    fontSize: '1rem'
                                }}
                                min="0"
                                max="120"
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ 
                                color: colors.text, 
                                display: 'block', 
                                marginBottom: '10px',
                                fontSize: '1.1rem'
                            }}>
                                Escolha um Avatar *
                            </label>
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(4, 1fr)', 
                                gap: '10px',
                                maxHeight: '200px',
                                overflowY: 'auto'
                            }}>
                                {defaultAvatars.map((avatar, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setNewProfile({...newProfile, avatar})}
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '50%',
                                            background: newProfile.avatar === avatar ? colors.primary : colors.background,
                                            border: `2px solid ${newProfile.avatar === avatar ? colors.primary : colors.border}`,
                                            fontSize: '2rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {avatar}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ 
                                color: colors.text, 
                                display: 'flex', 
                                alignItems: 'center',
                                gap: '10px',
                                fontSize: '1.1rem'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={newProfile.isChild}
                                    onChange={(e) => setNewProfile({...newProfile, isChild: e.target.checked})}
                                />
                                Perfil Infantil
                            </label>
                        </div>

                        {newProfile.isChild && (
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ 
                                    color: colors.text, 
                                    display: 'block', 
                                    marginBottom: '10px',
                                    fontSize: '1.1rem'
                                }}>
                                    Classificação Máxima
                                </label>
                                <select
                                    value={newProfile.restrictions.maxAgeRating}
                                    onChange={(e) => setNewProfile({
                                        ...newProfile, 
                                        restrictions: {
                                            ...newProfile.restrictions,
                                            maxAgeRating: e.target.value
                                        }
                                    })}
                                    style={{
                                        width: '100%',
                                        padding: '15px',
                                        borderRadius: '8px',
                                        border: `1px solid ${colors.border}`,
                                        background: colors.background,
                                        color: colors.text,
                                        fontSize: '1rem'
                                    }}
                                >
                                    <option value="L">L - Livre</option>
                                    <option value="10">10 anos</option>
                                    <option value="12">12 anos</option>
                                </select>
                            </div>
                        )}
                        
                        <div style={{ 
                            display: 'flex', 
                            gap: '15px',
                            justifyContent: 'center'
                        }}>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                style={{
                                    padding: '15px 30px',
                                    borderRadius: '8px',
                                    border: `1px solid ${colors.border}`,
                                    background: 'transparent',
                                    color: colors.text,
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    fontWeight: '600'
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCreateProfile}
                                style={{
                                    padding: '15px 30px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: colors.primary,
                                    color: '#000',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    fontWeight: '600'
                                }}
                            >
                                Criar Perfil
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileSelector;

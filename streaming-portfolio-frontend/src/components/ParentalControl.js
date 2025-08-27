import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from './Toast';
import './ParentalControl.css';

const ParentalControl = () => {
    const { user, token } = useAuth();
    const { colors } = useTheme();
    const toast = useToast();

    const [profiles, setProfiles] = useState([]);
    const [currentProfile, setCurrentProfile] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [newProfile, setNewProfile] = useState({
        name: '',
        age: 0,
        isChild: false,
        restrictions: {
            maxAgeRating: 'L',
            allowViolence: false,
            allowLanguage: false,
            allowAdultContent: false
        }
    });
    const [settings, setSettings] = useState({
        requirePin: false,
        pin: '',
        autoLock: false,
        lockTimeout: 30
    });

    useEffect(() => {
        if (user) {
            fetchProfiles();
            fetchSettings();
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

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/parental/settings', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setSettings(data);
            }
        } catch (err) {
            console.error('Error fetching settings:', err);
        }
    };

    const handleCreateProfile = async () => {
        if (!newProfile.name.trim()) {
            toast.error('Nome do perfil é obrigatório');
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

    const handleUpdateSettings = async () => {
        try {
            const response = await fetch('/api/parental/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(settings)
            });

            if (response.ok) {
                toast.success('Configurações atualizadas!');
                setShowSettingsModal(false);
            } else {
                throw new Error('Erro ao atualizar configurações');
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleSwitchProfile = async (profileId) => {
        try {
            const response = await fetch(`/api/parental/profiles/${profileId}/switch`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const profile = await response.json();
                setCurrentProfile(profile);
                toast.success(`Perfil alterado para: ${profile.name}`);
            } else {
                throw new Error('Erro ao alterar perfil');
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    const getAgeRatingColor = (rating) => {
        switch (rating) {
            case 'L': return '#00ff00';
            case '10': return '#ffff00';
            case '12': return '#ffa500';
            case '14': return '#ff6600';
            case '16': return '#ff3300';
            case '18': return '#ff0000';
            default: return '#666';
        }
    };

    if (!user) {
        return (
            <div style={{ color: colors.text, textAlign: 'center', padding: '2rem' }}>
                Faça login para acessar o Controle Parental
            </div>
        );
    }

    return (
        <div className="parental-control" style={{ backgroundColor: colors.background, minHeight: '100vh', padding: '20px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '40px'
                }}>
                    <div>
                        <h1 style={{ 
                            color: colors.text, 
                            fontSize: '3rem', 
                            marginBottom: '10px'
                        }}>
                            🔒 Controle Parental
                        </h1>
                        <p style={{ color: colors.textSecondary, fontSize: '1.1rem' }}>
                            Gerencie perfis e configurações de segurança
                        </p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            style={{
                                background: colors.primary,
                                color: '#000',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            👶 Criar Perfil
                        </button>
                        <button
                            onClick={() => setShowSettingsModal(true)}
                            style={{
                                background: colors.surface,
                                color: colors.text,
                                border: `1px solid ${colors.border}`,
                                padding: '12px 24px',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            ⚙️ Configurações
                        </button>
                    </div>
                </div>

                {/* Current Profile */}
                {currentProfile && (
                    <div style={{
                        background: colors.surface,
                        borderRadius: '12px',
                        padding: '20px',
                        marginBottom: '30px',
                        border: `1px solid ${colors.border}`
                    }}>
                        <h2 style={{ color: colors.text, marginBottom: '15px' }}>
                            Perfil Ativo: {currentProfile.name}
                        </h2>
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                            <div style={{ 
                                background: getAgeRatingColor(currentProfile.restrictions.maxAgeRating),
                                color: '#000',
                                padding: '5px 12px',
                                borderRadius: '20px',
                                fontWeight: '600'
                            }}>
                                Classificação: {currentProfile.restrictions.maxAgeRating}
                            </div>
                            <div style={{ color: colors.textSecondary }}>
                                Idade: {currentProfile.age} anos
                            </div>
                            {currentProfile.isChild && (
                                <div style={{ 
                                    background: '#ff6b6b',
                                    color: 'white',
                                    padding: '5px 12px',
                                    borderRadius: '20px',
                                    fontWeight: '600'
                                }}>
                                    👶 Perfil Infantil
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Profiles Grid */}
                <div style={{ 
                    display: 'grid', 
                    gap: '20px',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
                }}>
                    {profiles.map(profile => (
                        <div key={profile.id} style={{
                            background: colors.surface,
                            borderRadius: '12px',
                            padding: '20px',
                            border: `1px solid ${colors.border}`,
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                        onClick={() => handleSwitchProfile(profile.id)}
                        >
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                marginBottom: '15px'
                            }}>
                                <h3 style={{ 
                                    color: colors.text, 
                                    fontSize: '1.3rem', 
                                    margin: 0
                                }}>
                                    {profile.name}
                                </h3>
                                <div style={{ 
                                    background: getAgeRatingColor(profile.restrictions.maxAgeRating),
                                    color: '#000',
                                    padding: '3px 8px',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600'
                                }}>
                                    {profile.restrictions.maxAgeRating}
                                </div>
                            </div>
                            
                            <div style={{ marginBottom: '15px' }}>
                                <p style={{ 
                                    color: colors.textSecondary, 
                                    fontSize: '0.9rem',
                                    marginBottom: '8px'
                                }}>
                                    Idade: {profile.age} anos
                                </p>
                                {profile.isChild && (
                                    <p style={{ 
                                        color: '#ff6b6b', 
                                        fontSize: '0.9rem',
                                        fontWeight: '600'
                                    }}>
                                        👶 Perfil Infantil
                                    </p>
                                )}
                            </div>

                            <div style={{ 
                                display: 'grid', 
                                gap: '5px',
                                fontSize: '0.8rem'
                            }}>
                                <div style={{ 
                                    color: colors.textSecondary,
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <span>Violência:</span>
                                    <span style={{ color: profile.restrictions.allowViolence ? '#ff6b6b' : '#00ff00' }}>
                                        {profile.restrictions.allowViolence ? '❌' : '✅'}
                                    </span>
                                </div>
                                <div style={{ 
                                    color: colors.textSecondary,
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <span>Linguagem:</span>
                                    <span style={{ color: profile.restrictions.allowLanguage ? '#ff6b6b' : '#00ff00' }}>
                                        {profile.restrictions.allowLanguage ? '❌' : '✅'}
                                    </span>
                                </div>
                                <div style={{ 
                                    color: colors.textSecondary,
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <span>Conteúdo Adulto:</span>
                                    <span style={{ color: profile.restrictions.allowAdultContent ? '#ff6b6b' : '#00ff00' }}>
                                        {profile.restrictions.allowAdultContent ? '❌' : '✅'}
                                    </span>
                                </div>
                            </div>

                            <button
                                style={{
                                    width: '100%',
                                    background: currentProfile?.id === profile.id ? colors.primary : 'transparent',
                                    color: currentProfile?.id === profile.id ? '#000' : colors.text,
                                    border: `1px solid ${colors.border}`,
                                    padding: '10px',
                                    borderRadius: '6px',
                                    marginTop: '15px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                {currentProfile?.id === profile.id ? '✓ Ativo' : 'Ativar Perfil'}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Create Profile Modal */}
                {showCreateModal && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            background: colors.surface,
                            borderRadius: '12px',
                            padding: '30px',
                            maxWidth: '500px',
                            width: '90%',
                            border: `1px solid ${colors.border}`
                        }}>
                            <h2 style={{ 
                                color: colors.text, 
                                fontSize: '1.5rem', 
                                marginBottom: '20px' 
                            }}>
                                Criar Novo Perfil
                            </h2>
                            
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ 
                                    color: colors.text, 
                                    display: 'block', 
                                    marginBottom: '5px' 
                                }}>
                                    Nome do Perfil *
                                </label>
                                <input
                                    type="text"
                                    value={newProfile.name}
                                    onChange={(e) => setNewProfile({...newProfile, name: e.target.value})}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '6px',
                                        border: `1px solid ${colors.border}`,
                                        background: colors.background,
                                        color: colors.text
                                    }}
                                    placeholder="Ex: João (10 anos)"
                                />
                            </div>
                            
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ 
                                    color: colors.text, 
                                    display: 'block', 
                                    marginBottom: '5px' 
                                }}>
                                    Idade
                                </label>
                                <input
                                    type="number"
                                    value={newProfile.age}
                                    onChange={(e) => setNewProfile({...newProfile, age: parseInt(e.target.value) || 0})}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '6px',
                                        border: `1px solid ${colors.border}`,
                                        background: colors.background,
                                        color: colors.text
                                    }}
                                    min="0"
                                    max="120"
                                />
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ 
                                    color: colors.text, 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={newProfile.isChild}
                                        onChange={(e) => setNewProfile({...newProfile, isChild: e.target.checked})}
                                    />
                                    Perfil Infantil
                                </label>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ 
                                    color: colors.text, 
                                    display: 'block', 
                                    marginBottom: '5px' 
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
                                        padding: '10px',
                                        borderRadius: '6px',
                                        border: `1px solid ${colors.border}`,
                                        background: colors.background,
                                        color: colors.text
                                    }}
                                >
                                    <option value="L">L - Livre</option>
                                    <option value="10">10 anos</option>
                                    <option value="12">12 anos</option>
                                    <option value="14">14 anos</option>
                                    <option value="16">16 anos</option>
                                    <option value="18">18 anos</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <h4 style={{ color: colors.text, marginBottom: '10px' }}>Restrições:</h4>
                                <div style={{ display: 'grid', gap: '8px' }}>
                                    <label style={{ 
                                        color: colors.text, 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={newProfile.restrictions.allowViolence}
                                            onChange={(e) => setNewProfile({
                                                ...newProfile, 
                                                restrictions: {
                                                    ...newProfile.restrictions,
                                                    allowViolence: e.target.checked
                                                }
                                            })}
                                        />
                                        Permitir Violência
                                    </label>
                                    <label style={{ 
                                        color: colors.text, 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={newProfile.restrictions.allowLanguage}
                                            onChange={(e) => setNewProfile({
                                                ...newProfile, 
                                                restrictions: {
                                                    ...newProfile.restrictions,
                                                    allowLanguage: e.target.checked
                                                }
                                            })}
                                        />
                                        Permitir Linguagem Inadequada
                                    </label>
                                    <label style={{ 
                                        color: colors.text, 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={newProfile.restrictions.allowAdultContent}
                                            onChange={(e) => setNewProfile({
                                                ...newProfile, 
                                                restrictions: {
                                                    ...newProfile.restrictions,
                                                    allowAdultContent: e.target.checked
                                                }
                                            })}
                                        />
                                        Permitir Conteúdo Adulto
                                    </label>
                                </div>
                            </div>
                            
                            <div style={{ 
                                display: 'flex', 
                                gap: '10px',
                                justifyContent: 'flex-end'
                            }}>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '6px',
                                        border: `1px solid ${colors.border}`,
                                        background: 'transparent',
                                        color: colors.text,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleCreateProfile}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        background: colors.primary,
                                        color: '#000',
                                        cursor: 'pointer',
                                        fontWeight: '600'
                                    }}
                                >
                                    Criar Perfil
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Settings Modal */}
                {showSettingsModal && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            background: colors.surface,
                            borderRadius: '12px',
                            padding: '30px',
                            maxWidth: '500px',
                            width: '90%',
                            border: `1px solid ${colors.border}`
                        }}>
                            <h2 style={{ 
                                color: colors.text, 
                                fontSize: '1.5rem', 
                                marginBottom: '20px' 
                            }}>
                                Configurações de Segurança
                            </h2>
                            
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ 
                                    color: colors.text, 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={settings.requirePin}
                                        onChange={(e) => setSettings({...settings, requirePin: e.target.checked})}
                                    />
                                    Exigir PIN para alterar configurações
                                </label>
                            </div>

                            {settings.requirePin && (
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ 
                                        color: colors.text, 
                                        display: 'block', 
                                        marginBottom: '5px' 
                                    }}>
                                        PIN (4 dígitos)
                                    </label>
                                    <input
                                        type="password"
                                        value={settings.pin}
                                        onChange={(e) => setSettings({...settings, pin: e.target.value})}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            borderRadius: '6px',
                                            border: `1px solid ${colors.border}`,
                                            background: colors.background,
                                            color: colors.text
                                        }}
                                        placeholder="0000"
                                        maxLength="4"
                                    />
                                </div>
                            )}

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ 
                                    color: colors.text, 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={settings.autoLock}
                                        onChange={(e) => setSettings({...settings, autoLock: e.target.checked})}
                                    />
                                    Bloquear automaticamente após inatividade
                                </label>
                            </div>

                            {settings.autoLock && (
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ 
                                        color: colors.text, 
                                        display: 'block', 
                                        marginBottom: '5px' 
                                    }}>
                                        Tempo de inatividade (minutos)
                                    </label>
                                    <input
                                        type="number"
                                        value={settings.lockTimeout}
                                        onChange={(e) => setSettings({...settings, lockTimeout: parseInt(e.target.value) || 30})}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            borderRadius: '6px',
                                            border: `1px solid ${colors.border}`,
                                            background: colors.background,
                                            color: colors.text
                                        }}
                                        min="1"
                                        max="120"
                                    />
                                </div>
                            )}
                            
                            <div style={{ 
                                display: 'flex', 
                                gap: '10px',
                                justifyContent: 'flex-end'
                            }}>
                                <button
                                    onClick={() => setShowSettingsModal(false)}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '6px',
                                        border: `1px solid ${colors.border}`,
                                        background: 'transparent',
                                        color: colors.text,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleUpdateSettings}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        background: colors.primary,
                                        color: '#000',
                                        cursor: 'pointer',
                                        fontWeight: '600'
                                    }}
                                >
                                    Salvar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParentalControl;

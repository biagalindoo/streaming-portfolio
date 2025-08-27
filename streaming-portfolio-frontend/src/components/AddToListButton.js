import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from './Toast';

const AddToListButton = ({ itemId, itemTitle }) => {
    const { user, token } = useAuth();
    const { colors } = useTheme();
    const toast = useToast();

    const [showModal, setShowModal] = useState(false);
    const [userLists, setUserLists] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (showModal && user) {
            fetchUserLists();
        }
    }, [showModal, user]);

    const fetchUserLists = async () => {
        try {
            const response = await fetch('/api/social/lists');
            if (response.ok) {
                const allLists = await response.json();
                // Filter lists owned by current user
                const userOwnedLists = allLists.filter(list => 
                    list.creator && list.creator.id === user.id
                );
                setUserLists(userOwnedLists);
            }
        } catch (err) {
            console.error('Error fetching user lists:', err);
        }
    };

    const handleAddToList = async (listId) => {
        if (!token) {
            toast.error('Faça login para adicionar à lista');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/social/lists/${listId}/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ itemId })
            });

            if (response.ok) {
                const result = await response.json();
                toast.success(result.message);
                setShowModal(false);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao adicionar à lista');
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return null; // Don't show button if not logged in
    }

    return (
        <>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowModal(true);
                }}
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                title="Adicionar à lista"
            >
                📋
            </button>

            {/* Modal */}
            {showModal && (
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
                            Adicionar "{itemTitle}" à lista
                        </h2>
                        
                        {userLists.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <p style={{ color: colors.textSecondary, marginBottom: '15px' }}>
                                    Você ainda não tem listas criadas.
                                </p>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        // Navigate to lists page to create one
                                        window.location.href = '/lists';
                                    }}
                                    style={{
                                        background: colors.primary,
                                        color: '#000',
                                        border: 'none',
                                        padding: '10px 20px',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: '600'
                                    }}
                                >
                                    Criar Primeira Lista
                                </button>
                            </div>
                        ) : (
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {userLists.map(list => (
                                    <div 
                                        key={list.id}
                                        style={{
                                            padding: '15px',
                                            border: `1px solid ${colors.border}`,
                                            borderRadius: '8px',
                                            marginBottom: '10px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            ':hover': {
                                                background: colors.cardHover
                                            }
                                        }}
                                        onClick={() => handleAddToList(list.id)}
                                    >
                                        <h3 style={{ 
                                            color: colors.text, 
                                            fontSize: '1.1rem', 
                                            marginBottom: '5px' 
                                        }}>
                                            {list.name}
                                        </h3>
                                        <p style={{ 
                                            color: colors.textSecondary, 
                                            fontSize: '0.9rem',
                                            marginBottom: '5px'
                                        }}>
                                            {list.description}
                                        </p>
                                        <p style={{ 
                                            color: colors.textSecondary, 
                                            fontSize: '0.8rem' 
                                        }}>
                                            {list.items.length} itens
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        <div style={{ 
                            display: 'flex', 
                            gap: '10px',
                            justifyContent: 'flex-end',
                            marginTop: '20px'
                        }}>
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={loading}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '6px',
                                    border: `1px solid ${colors.border}`,
                                    background: 'transparent',
                                    color: colors.text,
                                    cursor: loading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddToListButton;

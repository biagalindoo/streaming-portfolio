import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from './Toast';
import MovieCard from './MovieCard';
import './PublicLists.css';

const PublicLists = () => {
    const { user, token } = useAuth();
    const { colors } = useTheme();
    const toast = useToast();

    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [shows, setShows] = useState([]);
    const [selectedList, setSelectedList] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showManageModal, setShowManageModal] = useState(false);
    const [newList, setNewList] = useState({
        name: '',
        description: '',
        items: [],
        isPublic: true
    });

    useEffect(() => {
        fetchLists();
        fetchShows();
    }, []);

    const fetchLists = async () => {
        try {
            const response = await fetch('/api/social/lists');
            if (!response.ok) throw new Error('Erro ao carregar listas');
            
            const data = await response.json();
            setLists(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchShows = async () => {
        try {
            const response = await fetch('/api/catalog');
            if (response.ok) {
                const data = await response.json();
                setShows(data);
            }
        } catch (err) {
            console.error('Error fetching shows:', err);
        }
    };

    const handleCreateList = async () => {
        if (!token) {
            toast.error('Faça login para criar listas');
            return;
        }

        if (!newList.name.trim()) {
            toast.error('Nome da lista é obrigatório');
            return;
        }

        try {
            const response = await fetch('/api/social/lists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newList)
            });

            if (response.ok) {
                const createdList = await response.json();
                setLists([createdList, ...lists]);
                setShowCreateModal(false);
                setNewList({ name: '', description: '', items: [], isPublic: true });
                toast.success('Lista criada com sucesso!');
            } else {
                throw new Error('Erro ao criar lista');
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleAddToFavorites = async (itemId) => {
        if (!token) {
            toast.error('Faça login para adicionar favoritos');
            return;
        }

        try {
            const response = await fetch('/api/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ itemId })
            });

            if (response.ok) {
                toast.success('Adicionado aos favoritos!');
            } else {
                throw new Error('Erro ao adicionar favorito');
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleAddToList = async (listId, itemId) => {
        if (!token) {
            toast.error('Faça login para adicionar à lista');
            return;
        }

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
                // Refresh lists to show updated data
                fetchLists();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao adicionar à lista');
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleRemoveFromList = async (listId, itemId) => {
        if (!token) {
            toast.error('Faça login para remover da lista');
            return;
        }

        try {
            const response = await fetch(`/api/social/lists/${listId}/items/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                toast.success(result.message);
                // Refresh lists to show updated data
                fetchLists();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao remover da lista');
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    if (loading) {
        return (
            <div style={{ color: colors.text, textAlign: 'center', padding: '2rem' }}>
                Carregando listas...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ color: colors.error, textAlign: 'center', padding: '2rem' }}>
                Erro: {error}
            </div>
        );
    }

    return (
        <div className="public-lists" style={{ backgroundColor: colors.background, minHeight: '100vh', padding: '20px' }}>
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
                            📋 Listas Públicas
                        </h1>
                        <p style={{ color: colors.textSecondary, fontSize: '1.1rem' }}>
                            Descubra listas criadas pela comunidade
                        </p>
                    </div>
                    
                    {user && (
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
                            ✨ Criar Lista
                        </button>
                    )}
                </div>

                {/* Lists Grid */}
                <div style={{ 
                    display: 'grid', 
                    gap: '20px',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'
                }}>
                    {lists.map(list => (
                        <div key={list.id} style={{
                            background: colors.surface,
                            borderRadius: '12px',
                            padding: '20px',
                            border: `1px solid ${colors.border}`,
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                                                 onClick={() => {
                             if (user && list.creator && user.id === list.creator.id) {
                                 setSelectedList(list);
                                 setShowManageModal(true);
                             } else {
                                 setSelectedList(selectedList?.id === list.id ? null : list);
                             }
                         }}
                        >
                            {/* List Header */}
                            <div style={{ marginBottom: '15px' }}>
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '10px',
                                    marginBottom: '10px'
                                }}>
                                                                         {list.creator && (
                                         <>
                                             <img 
                                                 src={list.creator.avatar} 
                                                 alt={list.creator.name}
                                                 style={{
                                                     width: '30px',
                                                     height: '30px',
                                                     borderRadius: '50%'
                                                 }}
                                             />
                                             <Link 
                                                 to={`/profile/${list.creator.id}`}
                                                 style={{ 
                                                     color: colors.primary, 
                                                     textDecoration: 'none',
                                                     fontWeight: '600'
                                                 }}
                                                 onClick={(e) => e.stopPropagation()}
                                             >
                                                 {list.creator.name}
                                             </Link>
                                         </>
                                     )}
                                </div>
                                
                                                                 <div style={{ 
                                     display: 'flex', 
                                     alignItems: 'center', 
                                     gap: '8px',
                                     marginBottom: '8px'
                                 }}>
                                     <h3 style={{ 
                                         color: colors.text, 
                                         fontSize: '1.3rem', 
                                         margin: 0
                                     }}>
                                         {list.name}
                                     </h3>
                                     {user && list.creator && user.id === list.creator.id && (
                                         <span style={{ 
                                             background: colors.primary,
                                             color: '#000',
                                             padding: '2px 8px',
                                             borderRadius: '12px',
                                             fontSize: '0.7rem',
                                             fontWeight: '600'
                                         }}>
                                             ✏️ Editar
                                         </span>
                                     )}
                                 </div>
                                
                                <p style={{ 
                                    color: colors.textSecondary, 
                                    fontSize: '0.9rem',
                                    marginBottom: '10px'
                                }}>
                                    {list.description}
                                </p>
                                
                                <div style={{ 
                                    color: colors.textSecondary, 
                                    fontSize: '0.8rem' 
                                }}>
                                    {list.items.length} itens • Criado em {new Date(list.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            {/* List Items Preview */}
                            {selectedList?.id === list.id && list.items.length > 0 && (
                                <div style={{ 
                                    borderTop: `1px solid ${colors.border}`,
                                    paddingTop: '15px'
                                }}>
                                    <h4 style={{ 
                                        color: colors.text, 
                                        fontSize: '1rem', 
                                        marginBottom: '15px' 
                                    }}>
                                        Itens da Lista:
                                    </h4>
                                    
                                    <div style={{ 
                                        display: 'grid', 
                                        gap: '10px',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))'
                                    }}>
                                        {list.items.slice(0, 6).map(itemId => {
                                            const show = shows.find(s => s.id === itemId);
                                            if (!show) return null;
                                            
                                            return (
                                                <div key={itemId} style={{ position: 'relative' }}>
                                                    <MovieCard 
                                                        id={show.id}
                                                        title={show.title}
                                                        posterUrl={show.coverUrl}
                                                        year={show.year}
                                                        duration={show.duration}
                                                        videoUrl={show.videoUrl}
                                                        rating={show.rating}
                                                    />
                                                                                                         {/* Show different buttons based on ownership */}
                                                     {user && list.creator && user.id === list.creator.id ? (
                                                         // Owner can remove from list
                                                         <button
                                                             onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 handleRemoveFromList(list.id, show.id);
                                                             }}
                                                             style={{
                                                                 position: 'absolute',
                                                                 top: '5px',
                                                                 right: '5px',
                                                                 background: 'rgba(255,0,0,0.8)',
                                                                 color: 'white',
                                                                 border: 'none',
                                                                 borderRadius: '50%',
                                                                 width: '30px',
                                                                 height: '30px',
                                                                 cursor: 'pointer',
                                                                 fontSize: '0.8rem'
                                                             }}
                                                             title="Remover da lista"
                                                         >
                                                             ✕
                                                         </button>
                                                     ) : (
                                                         // Others can add to favorites
                                                         <button
                                                             onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 handleAddToFavorites(show.id);
                                                             }}
                                                             style={{
                                                                 position: 'absolute',
                                                                 top: '5px',
                                                                 right: '5px',
                                                                 background: 'rgba(0,0,0,0.7)',
                                                                 color: 'white',
                                                                 border: 'none',
                                                                 borderRadius: '50%',
                                                                 width: '30px',
                                                                 height: '30px',
                                                                 cursor: 'pointer',
                                                                 fontSize: '0.8rem'
                                                             }}
                                                             title="Adicionar aos favoritos"
                                                         >
                                                             ❤️
                                                         </button>
                                                     )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    {list.items.length > 6 && (
                                        <p style={{ 
                                            color: colors.textSecondary, 
                                            fontSize: '0.8rem',
                                            textAlign: 'center',
                                            marginTop: '10px'
                                        }}>
                                            +{list.items.length - 6} mais itens
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Create List Modal */}
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
                                Criar Nova Lista
                            </h2>
                            
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ 
                                    color: colors.text, 
                                    display: 'block', 
                                    marginBottom: '5px' 
                                }}>
                                    Nome da Lista *
                                </label>
                                <input
                                    type="text"
                                    value={newList.name}
                                    onChange={(e) => setNewList({...newList, name: e.target.value})}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '6px',
                                        border: `1px solid ${colors.border}`,
                                        background: colors.background,
                                        color: colors.text
                                    }}
                                    placeholder="Ex: Meus Filmes Favoritos"
                                />
                            </div>
                            
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ 
                                    color: colors.text, 
                                    display: 'block', 
                                    marginBottom: '5px' 
                                }}>
                                    Descrição
                                </label>
                                <textarea
                                    value={newList.description}
                                    onChange={(e) => setNewList({...newList, description: e.target.value})}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '6px',
                                        border: `1px solid ${colors.border}`,
                                        background: colors.background,
                                        color: colors.text,
                                        minHeight: '80px',
                                        resize: 'vertical'
                                    }}
                                    placeholder="Descreva sua lista..."
                                />
                            </div>
                            
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ 
                                    color: colors.text, 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={newList.isPublic}
                                        onChange={(e) => setNewList({...newList, isPublic: e.target.checked})}
                                    />
                                    Lista Pública
                                </label>
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
                                    onClick={handleCreateList}
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
                                    Criar Lista
                                </button>
                            </div>
                        </div>
                    </div>
                                 )}

                 {/* Manage List Modal */}
                 {showManageModal && selectedList && (
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
                             maxWidth: '800px',
                             width: '90%',
                             maxHeight: '80vh',
                             overflow: 'hidden',
                             border: `1px solid ${colors.border}`
                         }}>
                             <div style={{ 
                                 display: 'flex', 
                                 justifyContent: 'space-between', 
                                 alignItems: 'center',
                                 marginBottom: '20px'
                             }}>
                                 <h2 style={{ 
                                     color: colors.text, 
                                     fontSize: '1.8rem', 
                                     margin: 0
                                 }}>
                                     Gerenciar: {selectedList.name}
                                 </h2>
                                 <button
                                     onClick={() => {
                                         setShowManageModal(false);
                                         setSelectedList(null);
                                     }}
                                     style={{
                                         background: 'transparent',
                                         border: 'none',
                                         fontSize: '1.5rem',
                                         color: colors.textSecondary,
                                         cursor: 'pointer'
                                     }}
                                 >
                                     ✕
                                 </button>
                             </div>

                             <div style={{ 
                                 display: 'grid', 
                                 gridTemplateColumns: '1fr 1fr', 
                                 gap: '20px',
                                 height: 'calc(80vh - 120px)',
                                 overflow: 'hidden'
                             }}>
                                 {/* Current Items */}
                                 <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                     <h3 style={{ 
                                         color: colors.text, 
                                         fontSize: '1.2rem', 
                                         marginBottom: '15px' 
                                     }}>
                                         Itens na Lista ({selectedList.items.length})
                                     </h3>
                                     
                                     <div style={{ 
                                         flex: 1, 
                                         overflowY: 'auto',
                                         border: `1px solid ${colors.border}`,
                                         borderRadius: '8px',
                                         padding: '10px'
                                     }}>
                                         {selectedList.items.length === 0 ? (
                                             <p style={{ 
                                                 color: colors.textSecondary, 
                                                 textAlign: 'center',
                                                 padding: '20px'
                                             }}>
                                                 Nenhum item na lista
                                             </p>
                                         ) : (
                                             <div style={{ display: 'grid', gap: '10px' }}>
                                                 {selectedList.items.map(itemId => {
                                                     const show = shows.find(s => s.id === itemId);
                                                     if (!show) return null;
                                                     
                                                     return (
                                                         <div key={itemId} style={{
                                                             display: 'flex',
                                                             alignItems: 'center',
                                                             gap: '10px',
                                                             padding: '10px',
                                                             border: `1px solid ${colors.border}`,
                                                             borderRadius: '6px',
                                                             background: colors.background
                                                         }}>
                                                             <img 
                                                                 src={show.coverUrl} 
                                                                 alt={show.title}
                                                                 style={{
                                                                     width: '50px',
                                                                     height: '75px',
                                                                     objectFit: 'cover',
                                                                     borderRadius: '4px'
                                                                 }}
                                                             />
                                                             <div style={{ flex: 1 }}>
                                                                 <div style={{ 
                                                                     color: colors.text, 
                                                                     fontWeight: '600',
                                                                     fontSize: '0.9rem'
                                                                 }}>
                                                                     {show.title}
                                                                 </div>
                                                                 <div style={{ 
                                                                     color: colors.textSecondary, 
                                                                     fontSize: '0.8rem'
                                                                 }}>
                                                                     {show.year} • {show.duration}
                                                                 </div>
                                                             </div>
                                                             <button
                                                                 onClick={() => handleRemoveFromList(selectedList.id, itemId)}
                                                                 style={{
                                                                     background: 'rgba(255,0,0,0.8)',
                                                                     color: 'white',
                                                                     border: 'none',
                                                                     borderRadius: '50%',
                                                                     width: '30px',
                                                                     height: '30px',
                                                                     cursor: 'pointer',
                                                                     fontSize: '0.8rem'
                                                                 }}
                                                                 title="Remover da lista"
                                                             >
                                                                 ✕
                                                             </button>
                                                         </div>
                                                     );
                                                 })}
                                             </div>
                                         )}
                                     </div>
                                 </div>

                                 {/* Add Items */}
                                 <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                     <h3 style={{ 
                                         color: colors.text, 
                                         fontSize: '1.2rem', 
                                         marginBottom: '15px' 
                                     }}>
                                         Adicionar Itens
                                     </h3>
                                     
                                     <div style={{ 
                                         flex: 1, 
                                         overflowY: 'auto',
                                         border: `1px solid ${colors.border}`,
                                         borderRadius: '8px',
                                         padding: '10px'
                                     }}>
                                         <div style={{ display: 'grid', gap: '10px' }}>
                                             {shows.map(show => {
                                                 const isInList = selectedList.items.includes(show.id);
                                                 
                                                 return (
                                                     <div key={show.id} style={{
                                                         display: 'flex',
                                                         alignItems: 'center',
                                                         gap: '10px',
                                                         padding: '10px',
                                                         border: `1px solid ${colors.border}`,
                                                         borderRadius: '6px',
                                                         background: colors.background,
                                                         opacity: isInList ? 0.5 : 1
                                                     }}>
                                                         <img 
                                                             src={show.coverUrl} 
                                                             alt={show.title}
                                                             style={{
                                                                 width: '50px',
                                                                 height: '75px',
                                                                 objectFit: 'cover',
                                                                 borderRadius: '4px'
                                                             }}
                                                         />
                                                         <div style={{ flex: 1 }}>
                                                             <div style={{ 
                                                                 color: colors.text, 
                                                                 fontWeight: '600',
                                                                 fontSize: '0.9rem'
                                                             }}>
                                                                 {show.title}
                                                             </div>
                                                             <div style={{ 
                                                                 color: colors.textSecondary, 
                                                                 fontSize: '0.8rem'
                                                             }}>
                                                                 {show.year} • {show.duration}
                                                             </div>
                                                         </div>
                                                         {isInList ? (
                                                             <span style={{ 
                                                                 color: colors.textSecondary, 
                                                                 fontSize: '0.8rem' 
                                                             }}>
                                                                 Já na lista
                                                             </span>
                                                         ) : (
                                                             <button
                                                                 onClick={() => handleAddToList(selectedList.id, show.id)}
                                                                 style={{
                                                                     background: colors.primary,
                                                                     color: '#000',
                                                                     border: 'none',
                                                                     borderRadius: '50%',
                                                                     width: '30px',
                                                                     height: '30px',
                                                                     cursor: 'pointer',
                                                                     fontSize: '0.8rem',
                                                                     fontWeight: 'bold'
                                                                 }}
                                                                 title="Adicionar à lista"
                                                             >
                                                                 +
                                                             </button>
                                                         )}
                                                     </div>
                                                 );
                                             })}
                                         </div>
                                     </div>
                                 </div>
                             </div>
                         </div>
                     </div>
                 )}
             </div>
         </div>
     );
 };

export default PublicLists;

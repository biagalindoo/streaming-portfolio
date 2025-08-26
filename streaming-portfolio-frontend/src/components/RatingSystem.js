import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from './Toast';

const RatingSystem = ({ itemId, onRatingChange }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [totalRatings, setTotalRatings] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCommentForm, setShowCommentForm] = useState(false);
    
    const { user, authHeaders } = useContext(AuthContext);
    const toast = useToast();

    // Carregar avaliações do item
    useEffect(() => {
        if (!itemId) return;
        
        fetch(`/api/ratings/${itemId}`)
            .then(response => response.json())
            .then(data => {
                setAverageRating(data.averageRating);
                setTotalRatings(data.totalRatings);
                
                // Encontrar avaliação do usuário atual
                if (user) {
                    const userRatingData = data.ratings.find(r => r.userId === user.id);
                    if (userRatingData) {
                        setUserRating(userRatingData.rating);
                        setRating(userRatingData.rating);
                        setComment(userRatingData.comment || '');
                    }
                }
            })
            .catch(error => console.error('Error loading ratings:', error));
    }, [itemId, user]);

    const handleRatingSubmit = async () => {
        if (rating === 0) {
            toast.error('Selecione uma avaliação');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/ratings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    itemId,
                    rating,
                    comment: showCommentForm ? comment : ''
                })
            });

            if (response.ok) {
                const newRating = await response.json();
                setUserRating(rating);
                toast.success('Avaliação enviada com sucesso!');
                
                // Recarregar avaliações para atualizar média
                const ratingsResponse = await fetch(`/api/ratings/${itemId}`);
                const ratingsData = await ratingsResponse.json();
                setAverageRating(ratingsData.averageRating);
                setTotalRatings(ratingsData.totalRatings);
                
                if (onRatingChange) {
                    onRatingChange(ratingsData);
                }
            } else {
                throw new Error('Falha ao enviar avaliação');
            }
        } catch (error) {
            toast.error('Erro ao enviar avaliação');
            console.error('Error submitting rating:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRatingDelete = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/ratings/${itemId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setUserRating(0);
                setRating(0);
                setComment('');
                toast.success('Avaliação removida');
                
                // Recarregar avaliações
                const ratingsResponse = await fetch(`/api/ratings/${itemId}`);
                const ratingsData = await ratingsResponse.json();
                setAverageRating(ratingsData.averageRating);
                setTotalRatings(ratingsData.totalRatings);
                
                if (onRatingChange) {
                    onRatingChange(ratingsData);
                }
            }
        } catch (error) {
            toast.error('Erro ao remover avaliação');
            console.error('Error deleting rating:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (value, isInteractive = true) => {
        return [...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
                <button
                    key={index}
                    type="button"
                    className={`star ${isInteractive ? 'interactive' : ''}`}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: isInteractive ? 'pointer' : 'default',
                        color: starValue <= value ? '#ffd700' : '#ccc',
                        transition: 'color 0.2s ease'
                    }}
                    onClick={isInteractive ? () => setRating(starValue) : undefined}
                    onMouseEnter={isInteractive ? () => setHover(starValue) : undefined}
                    onMouseLeave={isInteractive ? () => setHover(0) : undefined}
                >
                    ★
                </button>
            );
        });
    };

    return (
        <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)'
        }}>
            <h3 style={{ color: 'white', marginBottom: '16px', fontSize: '1.2rem' }}>
                Avaliações
            </h3>
            
            {/* Média das avaliações */}
            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    {renderStars(Math.round(averageRating), false)}
                    <span style={{ color: 'white', fontSize: '1.1rem', fontWeight: 600 }}>
                        {averageRating.toFixed(1)}
                    </span>
                    <span style={{ color: '#8b93a7', fontSize: '0.9rem' }}>
                        ({totalRatings} avaliações)
                    </span>
                </div>
            </div>

            {/* Avaliação do usuário */}
            {true ? (
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ marginBottom: '12px' }}>
                        <span style={{ color: 'white', fontSize: '1rem' }}>
                            {userRating > 0 ? 'Sua avaliação:' : 'Avalie este item:'}
                        </span>
                    </div>
                    
                    <div style={{ marginBottom: '16px' }}>
                        {renderStars(hover || rating, true)}
                    </div>
                    
                    {showCommentForm && (
                        <div style={{ marginBottom: '16px' }}>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Deixe um comentário (opcional)..."
                                style={{
                                    width: '100%',
                                    minHeight: '80px',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    background: 'rgba(255,255,255,0.1)',
                                    color: 'white',
                                    fontSize: '14px',
                                    resize: 'vertical'
                                }}
                            />
                        </div>
                    )}
                    
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                            onClick={handleRatingSubmit}
                            disabled={loading || rating === 0}
                            style={{
                                background: '#00d4ff',
                                color: '#000',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: loading || rating === 0 ? 'not-allowed' : 'pointer',
                                opacity: loading || rating === 0 ? 0.6 : 1
                            }}
                        >
                            {loading ? 'Enviando...' : userRating > 0 ? 'Atualizar' : 'Avaliar'}
                        </button>
                        
                        {userRating > 0 && (
                            <button
                                onClick={handleRatingDelete}
                                disabled={loading}
                                style={{
                                    background: '#ff6b6b',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.6 : 1
                                }}
                            >
                                Remover
                            </button>
                        )}
                        
                        <button
                            onClick={() => setShowCommentForm(!showCommentForm)}
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.2)',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                cursor: 'pointer'
                            }}
                        >
                            {showCommentForm ? 'Ocultar comentário' : 'Adicionar comentário'}
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '20px',
                    color: '#8b93a7'
                }}>
                    <p>Faça login para avaliar este item</p>
                </div>
            )}
        </div>
    );
};

export default RatingSystem;

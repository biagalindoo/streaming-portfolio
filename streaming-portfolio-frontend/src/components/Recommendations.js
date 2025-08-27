import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import MovieCard from './MovieCard';
import './Recommendations.css';

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState({
        continueWatching: [],
        recommended: [],
        becauseYouWatched: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, user } = useAuth();
    const { colors } = useTheme();

    useEffect(() => {
        if (token && user) {
            fetchRecommendations();
        } else if (!token) {
            setLoading(false);
            setError('Você precisa estar logado para ver recomendações');
        }
    }, [token, user]);

    const fetchRecommendations = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('Fetching recommendations with token:', token ? 'present' : 'missing');
            
            const response = await fetch('/api/recommendations', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.log('Error data:', errorData);
                throw new Error(errorData.error || `HTTP ${response.status}: Falha ao carregar recomendações`);
            }

            const data = await response.json();
            console.log('Recommendations data:', data);
            setRecommendations(data);
        } catch (err) {
            console.error('Error fetching recommendations:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ color: colors.text, textAlign: 'center', padding: '2rem' }}>
                Carregando recomendações...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ 
                color: colors.error, 
                textAlign: 'center', 
                padding: '2rem',
                maxWidth: '600px',
                margin: '0 auto'
            }}>
                <h3 style={{ color: colors.text, marginBottom: '1rem' }}>Erro ao carregar recomendações</h3>
                <p style={{ color: colors.textSecondary, marginBottom: '1rem' }}>{error}</p>
                {error.includes('logado') && (
                    <p style={{ color: colors.textSecondary, fontSize: '0.9rem' }}>
                        Faça login para ver recomendações personalizadas baseadas nos seus favoritos.
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="recommendations-container" style={{ backgroundColor: colors.background }}>
            {/* Continuar Assistindo */}
            {recommendations.continueWatching.length > 0 && (
                <section className="recommendations-section">
                    <h2 style={{ color: colors.text }}>Continuar Assistindo</h2>
                    <div className="recommendations-grid">
                        {recommendations.continueWatching.map((item) => (
                            <div key={item.id} className="continue-watching-item">
                                <MovieCard 
                                    id={item.id}
                                    title={item.title}
                                    posterUrl={item.coverUrl}
                                    year={item.year}
                                    duration={item.duration}
                                    videoUrl={item.videoUrl}
                                    rating={item.rating}
                                />
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill" 
                                        style={{ 
                                            width: `${item.progress}%`,
                                            backgroundColor: colors.primary 
                                        }}
                                    />
                                </div>
                                <span className="progress-text" style={{ color: colors.textSecondary }}>
                                    {item.progress}% assistido
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Porque você assistiu */}
            {recommendations.becauseYouWatched.length > 0 && (
                <section className="recommendations-section">
                    <h2 style={{ color: colors.text }}>Porque você assistiu</h2>
                    <div className="recommendations-grid">
                        {recommendations.becauseYouWatched.map((item) => (
                            <div key={item.id} className="because-you-watched-item">
                                <MovieCard 
                                    id={item.id}
                                    title={item.title}
                                    posterUrl={item.coverUrl}
                                    year={item.year}
                                    duration={item.duration}
                                    videoUrl={item.videoUrl}
                                    rating={item.rating}
                                />
                                <p className="reason-text" style={{ color: colors.textSecondary }}>
                                    {item.reason}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Recomendados para Você */}
            {recommendations.recommended.length > 0 && (
                <section className="recommendations-section">
                    <h2 style={{ color: colors.text }}>Recomendados para Você</h2>
                    <div className="recommendations-grid">
                        {recommendations.recommended.map((item) => (
                            <MovieCard 
                                key={item.id}
                                id={item.id}
                                title={item.title}
                                posterUrl={item.coverUrl}
                                year={item.year}
                                duration={item.duration}
                                videoUrl={item.videoUrl}
                                rating={item.rating}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Mensagem quando não há recomendações */}
            {recommendations.continueWatching.length === 0 && 
             recommendations.becauseYouWatched.length === 0 && 
             recommendations.recommended.length === 0 && (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '3rem',
                    color: colors.textSecondary 
                }}>
                    <h3>Nenhuma recomendação disponível</h3>
                    <p>Adicione alguns filmes ou séries à sua lista para receber recomendações personalizadas!</p>
                </div>
            )}
        </div>
    );
};

export default Recommendations;

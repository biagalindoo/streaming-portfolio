import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import MovieCard from './MovieCard';

const MyList = () => {
  const { authHeaders } = useContext(AuthContext);
  const { colors } = useTheme();
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [favRes, catRes] = await Promise.all([
          fetch('/api/favorites', { headers: { ...authHeaders() } }),
          fetch('/api/catalog'),
        ]);
        if (!favRes.ok) throw new Error('Falha ao carregar favoritos');
        if (!catRes.ok) throw new Error('Falha ao carregar catálogo');
        const favData = await favRes.json();
        const catData = await catRes.json();
                 if (active) {
           setFavoriteIds(Array.isArray(favData.favorites) ? favData.favorites : []);
           // Filtrar apenas shows e movies (não episódios)
           const filteredCatalog = Array.isArray(catData) ? catData.filter(item => item.type === 'show' || item.type === 'movie') : [];
           setCatalog(filteredCatalog);
         }
      } catch (e) {
        if (active) setError(e.message);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [authHeaders]);

  const items = useMemo(() => {
    const set = new Set(favoriteIds.map(String));
    return catalog.filter((c) => set.has(String(c.id)));
  }, [favoriteIds, catalog]);

  if (loading) return (
    <div style={{ 
      textAlign: 'center', 
      padding: '60px 20px',
      color: colors.text
    }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '16px' }}>
        Carregando sua lista...
      </div>
    </div>
  );
  
  if (error) return (
    <div style={{ 
      textAlign: 'center', 
      padding: '60px 20px',
      color: colors.error
    }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '16px' }}>
        Erro: {error}
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Section */}
      <div style={{ 
          background: colors.gradient,
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '40px',
          border: `1px solid ${colors.border}`,
          backdropFilter: colors.backdropBlur
      }}>
          <h1 style={{ 
              color: colors.text, 
              fontSize: '3rem', 
              marginBottom: '1rem',
              fontWeight: 700,
              textAlign: 'center'
          }}>
              Minha Lista
          </h1>
          <p style={{ 
              color: colors.textSecondary, 
              fontSize: '1.1rem', 
              textAlign: 'center'
          }}>
              {items.length === 0 ? 'Você ainda não adicionou favoritos.' : `${items.length} item${items.length !== 1 ? 's' : ''} na sua lista`}
          </p>
      </div>

      {items.length === 0 ? (
        <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            color: colors.textSecondary
        }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '16px' }}>
                Nenhum favorito ainda
            </div>
            <div style={{ fontSize: '1rem' }}>
                Adicione filmes e séries à sua lista para vê-los aqui
            </div>
        </div>
      ) : (
        <div style={{ 
            display: 'grid', 
            gap: 24, 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))'
        }}>
          {items.map((item) => (
            <MovieCard key={item.id} id={item.id} title={item.title} posterUrl={item.coverUrl} year={item.year} duration={item.duration} videoUrl={item.videoUrl} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyList;



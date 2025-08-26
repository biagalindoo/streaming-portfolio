import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import MovieCard from './MovieCard';

const MyList = () => {
  const { authHeaders } = useContext(AuthContext);
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

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div>
      <h1>Minha lista</h1>
      {items.length === 0 ? (
        <p>Você ainda não adicionou favoritos.</p>
      ) : (
        <div className="grid">
                     {items.map((item) => (
             <MovieCard key={item.id} id={item.id} title={item.title} posterUrl={item.coverUrl} year={item.year} duration={item.duration} videoUrl={item.videoUrl} />
           ))}
        </div>
      )}
    </div>
  );
};

export default MyList;



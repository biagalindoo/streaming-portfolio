// src/components/Catalog.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Catalog = () => {
    const [series, setSeries] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/catalog')
            .then(response => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            })
            .then(data => setSeries(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>Erro: {error}</p>;

    return (
        <div>
            <h1>Catálogo de Séries</h1>
            <ul>
                {series.map(serie => (
                    <li key={serie.id}>
                        <Link to={`/movies/${serie.id}`}>{serie.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Catalog;

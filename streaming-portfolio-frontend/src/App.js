// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Catalog from './components/Catalog';
import Login from './components/Login';
import Signup from './components/Signup';
import Layout from './components/Layout';
import MovieDetail from './components/MovieDetail';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<Catalog />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                    <Route path="movies/:id" element={<MovieDetail />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;

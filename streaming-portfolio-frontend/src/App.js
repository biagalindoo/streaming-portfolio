// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Catalog from './components/Catalog';
import Login from './components/Login';
import Signup from './components/Signup';
import Layout from './components/Layout';
import MovieDetail from './components/MovieDetail';
import ProtectedRoute from './components/ProtectedRoute';
import UserPage from './components/UserPage';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import MyList from './components/MyList';

const App = () => {
    return (
        <AuthProvider>
            <ToastProvider>
                <BrowserRouter>
                    <Routes>
                        <Route element={<Layout />}>
                            <Route index element={<Catalog />} />
                            <Route path="login" element={<Login />} />
                            <Route path="signup" element={<Signup />} />
                            <Route path="movies/:id" element={<MovieDetail />} />
                            <Route path="user" element={<ProtectedRoute><UserPage /></ProtectedRoute>} />
                            <Route path="my-list" element={<ProtectedRoute><MyList /></ProtectedRoute>} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </ToastProvider>
        </AuthProvider>
    );
};

export default App;

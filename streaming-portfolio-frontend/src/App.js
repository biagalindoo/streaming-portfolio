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
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/Toast';
import MyList from './components/MyList';
import Recommendations from './components/Recommendations';
import UserProfile from './components/UserProfile';
import Rankings from './components/Rankings';
import PublicLists from './components/PublicLists';
import ParentalControl from './components/ParentalControl';
import ProfileGuard from './components/ProfileGuard';

const App = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <ToastProvider>
                <BrowserRouter>
                    <Routes>
                        <Route element={<Layout />}>
                            <Route index element={<Catalog />} />
                            <Route path="login" element={<Login />} />
                            <Route path="signup" element={<Signup />} />
                            <Route path="movies/:id" element={<ProtectedRoute><MovieDetail /></ProtectedRoute>} />
                            <Route path="user" element={<ProtectedRoute><UserPage /></ProtectedRoute>} />
                            <Route path="my-list" element={<ProtectedRoute><MyList /></ProtectedRoute>} />
                            <Route path="recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
                            <Route path="profile/:id" element={<UserProfile />} />
                            <Route path="rankings" element={<Rankings />} />
                            <Route path="lists" element={<PublicLists />} />
                            <Route path="parental" element={<ParentalControl />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
                </ToastProvider>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileSelector from './ProfileSelector';

const ProfileGuard = ({ children }) => {
    const { user, currentProfile } = useAuth();

    // Se não está logado, redireciona para login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Se está logado mas não tem perfil ativo, mostra seletor de perfil
    if (!currentProfile) {
        return <ProfileSelector />;
    }

    // Se tem perfil ativo, mostra o conteúdo
    return children;
};

export default ProfileGuard;

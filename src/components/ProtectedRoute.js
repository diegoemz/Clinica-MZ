import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Login from './Login';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Mostrar spinner mientras se verifica la autenticación
  if (loading) {
    return <LoadingSpinner />;
  }

  // Si no hay usuario autenticado, mostrar login
  if (!user) {
    return <Login />;
  }

  // Si hay usuario autenticado, mostrar el contenido protegido
  return children;
};

export default ProtectedRoute;
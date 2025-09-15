// components/AuthDebug.js
// Componente temporal para verificar autenticación

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../firebase/config';

const AuthDebug = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50 max-w-sm">
      <h3 className="font-bold text-sm mb-2">🔍 Debug Auth</h3>
      <div className="text-xs space-y-1">
        <div>
          <strong>Autenticado:</strong> {isAuthenticated ? '✅ Sí' : '❌ No'}
        </div>
        <div>
          <strong>Usuario:</strong> {user?.email || 'No hay usuario'}
        </div>
        <div>
          <strong>UID:</strong> {user?.uid || 'N/A'}
        </div>
        <div>
          <strong>Auth actual:</strong> {auth.currentUser?.email || 'No auth'}
        </div>
        <div>
          <strong>Token válido:</strong> {auth.currentUser ? '✅' : '❌'}
        </div>
      </div>
      
      {!isAuthenticated && (
        <div className="mt-2 p-2 bg-red-100 text-red-700 text-xs rounded">
          ⚠️ Usuario no autenticado - esto causará errores de permisos
        </div>
      )}
    </div>
  );
};

export default AuthDebug;
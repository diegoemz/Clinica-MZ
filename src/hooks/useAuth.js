// hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';
import {
  onAuthChange,
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  resetPassword,
  updateUserProfile,
  changePassword
} from '../services/authService';

// Crear contexto de autenticación
const AuthContext = createContext();

// Hook para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Provider de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Función para iniciar sesión
  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await signInWithEmail(email, password);
      
      if (!result.success) {
        setError(result.message);
        return result;
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Función para registrarse
  const signUp = async (email, password, displayName) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await signUpWithEmail(email, password, displayName);
      
      if (!result.success) {
        setError(result.message);
        return result;
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const signOut = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await signOutUser();
      
      if (!result.success) {
        setError(result.message);
        return result;
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Función para recuperar contraseña
  const forgotPassword = async (email) => {
    setError(null);
    
    try {
      const result = await resetPassword(email);
      
      if (!result.success) {
        setError(result.message);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  // Función para actualizar perfil
  const updateProfile = async (displayName, photoURL = null) => {
    setError(null);
    
    try {
      const result = await updateUserProfile(displayName, photoURL);
      
      if (!result.success) {
        setError(result.message);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  // Función para cambiar contraseña
  const updatePassword = async (currentPassword, newPassword) => {
    setError(null);
    
    try {
      const result = await changePassword(currentPassword, newPassword);
      
      if (!result.success) {
        setError(result.message);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  // Limpiar errores
  const clearError = () => {
    setError(null);
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = !!user;

  // Obtener información del usuario
  const getUserInfo = () => ({
    uid: user?.uid,
    email: user?.email,
    displayName: user?.displayName,
    photoURL: user?.photoURL,
    emailVerified: user?.emailVerified,
    createdAt: user?.metadata?.creationTime,
    lastSignIn: user?.metadata?.lastSignInTime
  });

  const value = {
    // Estado
    user,
    loading,
    error,
    isAuthenticated,
    
    // Funciones de autenticación
    signIn,
    signUp,
    signOut,
    forgotPassword,
    
    // Funciones de perfil
    updateProfile,
    updatePassword,
    getUserInfo,
    
    // Utilidades
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
// services/authService.js
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { auth } from '../firebase/config';

// ===================
// AUTENTICACIÓN BÁSICA
// ===================

// Iniciar sesión con email y contraseña
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user,
      message: 'Inicio de sesión exitoso'
    };
  } catch (error) {
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code)
    };
  }
};

// Registrar nuevo usuario
export const signUpWithEmail = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Actualizar el perfil con el nombre
    if (displayName) {
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
    }
    
    return {
      success: true,
      user: userCredential.user,
      message: 'Cuenta creada exitosamente'
    };
  } catch (error) {
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code)
    };
  }
};

// Cerrar sesión
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return {
      success: true,
      message: 'Sesión cerrada exitosamente'
    };
  } catch (error) {
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code)
    };
  }
};

// ===================
// GESTIÓN DE PERFIL
// ===================

// Actualizar perfil del usuario
export const updateUserProfile = async (displayName, photoURL = null) => {
  try {
    const updates = { displayName };
    if (photoURL) updates.photoURL = photoURL;
    
    await updateProfile(auth.currentUser, updates);
    return {
      success: true,
      message: 'Perfil actualizado exitosamente'
    };
  } catch (error) {
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code)
    };
  }
};

// ===================
// RECUPERACIÓN DE CONTRASEÑA
// ===================

// Enviar email de recuperación de contraseña
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: 'Email de recuperación enviado. Revisa tu bandeja de entrada.'
    };
  } catch (error) {
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code)
    };
  }
};

// Cambiar contraseña (requiere reautenticación)
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }

    // Reautenticar usuario
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Actualizar contraseña
    await updatePassword(user, newPassword);
    
    return {
      success: true,
      message: 'Contraseña actualizada exitosamente'
    };
  } catch (error) {
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code)
    };
  }
};

// ===================
// OBSERVADORES
// ===================

// Escuchar cambios en el estado de autenticación
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Obtener usuario actual
export const getCurrentUser = () => {
  return auth.currentUser;
};

// ===================
// UTILIDADES
// ===================

// Convertir códigos de error a mensajes legibles
const getErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/user-not-found': 'No existe una cuenta con este email',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/email-already-in-use': 'Ya existe una cuenta con este email',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
    'auth/invalid-email': 'El email no es válido',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
    'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde',
    'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
    'auth/invalid-credential': 'Credenciales inválidas',
    'auth/requires-recent-login': 'Necesitas iniciar sesión nuevamente para esta acción',
    'auth/operation-not-allowed': 'Operación no permitida',
    'auth/missing-password': 'Debe proporcionar una contraseña',
    'auth/invalid-login-credentials': 'Email o contraseña incorrectos'
  };

  return errorMessages[errorCode] || 'Ha ocurrido un error. Intenta nuevamente.';
};

// Validar formato de email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar fortaleza de contraseña
export const validatePassword = (password) => {
  const minLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  return {
    isValid: minLength,
    minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    score: [minLength, hasUpperCase, hasLowerCase, hasNumbers].filter(Boolean).length
  };
};

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  return !!auth.currentUser;
};
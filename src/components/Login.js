import React, { useState } from 'react';
import { Heart, Mail, Lock, Eye, EyeOff, Sparkles, Stethoscope } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { validateEmail } from '../services/authService';

const Login = () => {
  const { signIn, forgotPassword, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [message, setMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Validar formulario
  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'El email no es válido';
    }

    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setMessage('');

    if (!validateForm()) {
      return;
    }

    const result = await signIn(formData.email, formData.password);
    
    if (result.success) {
      setMessage('¡Bienvenida de vuelta!');
    }
  };

  // Manejar recuperación de contraseña
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    clearError();
    setMessage('');

    if (!forgotEmail) {
      setMessage('Por favor ingresa tu email');
      return;
    }

    if (!validateEmail(forgotEmail)) {
      setMessage('Por favor ingresa un email válido');
      return;
    }

    const result = await forgotPassword(forgotEmail);
    
    if (result.success) {
      setMessage('Email de recuperación enviado. Revisa tu bandeja de entrada.');
      setShowForgotPassword(false);
      setForgotEmail('');
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores al escribir
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header con logo */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-sky-500 to-cyan-500 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Stethoscope size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Consultorio Ginecológico</h1>
          <p className="text-gray-600">Acceso al sistema de gestión</p>
        </div>

        {/* Formulario principal */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          {!showForgotPassword ? (
            <>
              {/* Formulario de login */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                  <Sparkles className="text-sky-500" size={24} />
                  Iniciar Sesión
                </h2>
                <p className="text-gray-600">Ingresa tus credenciales para continuar</p>
              </div>

              {/* Mensajes */}
              {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-xl">
                  {error}
                </div>
              )}

              {message && (
                <div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-700 rounded-xl">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campo de email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 disabled:opacity-50 ${
                        formErrors.email 
                          ? 'border-red-300 focus:border-red-400 focus:ring-red-100' 
                          : 'border-gray-200 focus:border-sky-400 focus:ring-sky-100'
                      }`}
                      placeholder="doctora@ejemplo.com"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>

                {/* Campo de contraseña */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 disabled:opacity-50 ${
                        formErrors.password 
                          ? 'border-red-300 focus:border-red-400 focus:ring-red-100' 
                          : 'border-gray-200 focus:border-sky-400 focus:ring-sky-100'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.password}</p>
                  )}
                </div>

                {/* Enlace de recuperación */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sky-600 hover:text-sky-800 text-sm font-medium transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                {/* Botón de envío */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 text-white py-4 rounded-xl hover:from-sky-600 hover:to-cyan-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <Heart size={20} />
                      Iniciar Sesión
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Formulario de recuperación de contraseña */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Recuperar Contraseña</h2>
                <p className="text-gray-600">Ingresa tu email para recibir las instrucciones</p>
              </div>

              {message && (
                <div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-700 rounded-xl">
                  {message}
                </div>
              )}

              {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-xl">
                  {error}
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      disabled={loading}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition-all duration-300 disabled:opacity-50"
                      placeholder="doctora@ejemplo.com"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-sky-500 to-cyan-500 text-white py-3 rounded-xl hover:from-sky-600 hover:to-cyan-600 transition-all duration-300 font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Enviando...' : 'Enviar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setMessage('');
                      clearError();
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold"
                  >
                    Volver
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Heart size={16} className="text-sky-500" />
            <span className="text-sm">Cuidando la salud femenina con dedicación</span>
            <Heart size={16} className="text-cyan-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
import React, { useState } from 'react';
import { X, User, Lock, Save, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { validatePassword } from '../services/authService';

const UserSettingsModal = ({ showModal, setShowModal }) => {
  const { user, updateProfile, updatePassword, getUserInfo } = useAuth();
  const userInfo = getUserInfo();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Estados para perfil
  const [profileData, setProfileData] = useState({
    displayName: userInfo.displayName || ''
  });
  
  // Estados para contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Manejar actualización de perfil
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!profileData.displayName.trim()) {
      setError('El nombre es requerido');
      setLoading(false);
      return;
    }

    try {
      const result = await updateProfile(profileData.displayName.trim());
      
      if (result.success) {
        setMessage('Perfil actualizado exitosamente');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambio de contraseña
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Validaciones
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('Todos los campos son requeridos');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Las contraseñas nuevas no coinciden');
      setLoading(false);
      return;
    }

    const passwordValidation = validatePassword(passwordData.newPassword);
    if (!passwordValidation.isValid) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const result = await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      
      if (result.success) {
        setMessage('Contraseña actualizada exitosamente');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800">Configuración</h3>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-4 px-6 font-semibold transition-all duration-300 ${
              activeTab === 'profile'
                ? 'text-sky-600 border-b-2 border-sky-500 bg-sky-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <User size={20} className="inline mr-2" />
            Perfil
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-4 px-6 font-semibold transition-all duration-300 ${
              activeTab === 'password'
                ? 'text-sky-600 border-b-2 border-sky-500 bg-sky-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Lock size={20} className="inline mr-2" />
            Contraseña
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Mensajes */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm">
              {message}
            </div>
          )}

          {/* Tab de Perfil */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={profileData.displayName}
                  onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                  disabled={loading}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition-all duration-300 disabled:opacity-50"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={userInfo.email}
                  disabled
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  El email no se puede modificar
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 text-white py-3 rounded-xl hover:from-sky-600 hover:to-cyan-600 transition-all duration-300 font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save size={20} />
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </form>
          )}

          {/* Tab de Contraseña */}
          {activeTab === 'password' && (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contraseña actual
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    disabled={loading}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition-all duration-300 disabled:opacity-50"
                    placeholder="Contraseña actual"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    disabled={loading}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition-all duration-300 disabled:opacity-50"
                    placeholder="Nueva contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmar nueva contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    disabled={loading}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition-all duration-300 disabled:opacity-50"
                    placeholder="Confirmar nueva contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 text-white py-3 rounded-xl hover:from-sky-600 hover:to-cyan-600 transition-all duration-300 font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Lock size={20} />
                {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSettingsModal;
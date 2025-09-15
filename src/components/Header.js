import React, { useState } from 'react';
import { Flower2, Heart, Sparkles, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Header = ({ doctorName }) => {
  const { user, signOut, getUserInfo } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userInfo = getUserInfo();

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      setShowUserMenu(false);
    }
  };

  return (
    <header className="bg-gradient-to-r from-sky-600 via-cyan-600 to-sky-700 text-white shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8">
        <Flower2 size={150} className="opacity-20" />
      </div>
      <div className="absolute bottom-0 left-0 transform -translate-x-8 translate-y-8">
        <Heart size={100} className="opacity-20" />
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Consultorio Ginecológico</h1>
            <p className="text-sky-100 text-lg font-medium">
              {userInfo.displayName || doctorName}
            </p>
            <p className="text-sky-200 mt-1">Cuidando tu salud femenina con dedicación y profesionalismo</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Info del usuario */}
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4">
              <Sparkles size={32} className="text-white" />
            </div>
            
            {/* Menú de usuario */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-3 flex items-center gap-3 hover:bg-opacity-30 transition-all duration-300"
              >
                <div className="bg-sky-500 p-2 rounded-full">
                  <User size={20} className="text-white" />
                </div>
                <div className="text-left hidden md:block">
                  <p className="font-semibold text-sm">
                    {userInfo.displayName || 'Usuario'}
                  </p>
                  <p className="text-sky-200 text-xs">
                    {userInfo.email}
                  </p>
                </div>
                <ChevronDown size={16} className="text-sky-200" />
              </button>

              {/* Dropdown del menú de usuario */}
              {showUserMenu && (
                <>
                  {/* Overlay para cerrar el menú */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowUserMenu(false)}
                  ></div>
                  
                  {/* Menú desplegable */}
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-20 overflow-hidden">
                    {/* Header del menú */}
                    <div className="bg-gradient-to-r from-sky-50 to-cyan-50 p-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="bg-sky-500 p-2 rounded-full">
                          <User size={16} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {userInfo.displayName || 'Usuario'}
                          </p>
                          <p className="text-gray-600 text-xs">
                            {userInfo.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Información de la cuenta */}
                    <div className="p-4 border-b border-gray-100">
                      <div className="space-y-2 text-xs text-gray-600">
                        <div className="flex justify-between">
                          <span>Última sesión:</span>
                          <span className="font-medium">
                            {userInfo.lastSignIn ? 
                              new Date(userInfo.lastSignIn).toLocaleDateString('es-ES') : 
                              'N/A'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cuenta creada:</span>
                          <span className="font-medium">
                            {userInfo.createdAt ? 
                              new Date(userInfo.createdAt).toLocaleDateString('es-ES') : 
                              'N/A'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estado:</span>
                          <span className={`font-medium ${userInfo.emailVerified ? 'text-green-600' : 'text-amber-600'}`}>
                            {userInfo.emailVerified ? 'Verificado' : 'Pendiente'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Opciones del menú */}
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          // Aquí podrías abrir un modal de configuración
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors text-sm"
                      >
                        <Settings size={16} className="text-gray-500" />
                        Configuración
                      </button>
                      
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm"
                      >
                        <LogOut size={16} />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          {/* Spinner principal */}
          <div className="w-20 h-20 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin mx-auto mb-6"></div>
          
          {/* Icono en el centro */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart size={32} className="text-sky-500 animate-pulse" />
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles size={24} className="text-sky-500 animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-800">Cargando...</h2>
          <Sparkles size={24} className="text-cyan-500 animate-pulse" />
        </div>
        
        <p className="text-gray-600 animate-pulse">
          Sincronizando datos del consultorio
        </p>
        
        {/* Puntos de carga animados */}
        <div className="flex justify-center gap-2 mt-6">
          <div className="w-3 h-3 bg-sky-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Plus, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Calendar, 
  FileText,
  Play
} from 'lucide-react';
import { 
  createFirestoreCollections, 
  clearAllCollections, 
  checkCollectionsStatus 
} from '../utils/createCollections';

const CollectionManager = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [collections, setCollections] = useState({});

  // Verificar estado de colecciones al cargar
  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const result = await checkCollectionsStatus();
      if (result.success) {
        setCollections(result.status);
        setStatus('success');
      } else {
        setStatus('error');
        setMessage(result.error);
      }
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollections = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const result = await createFirestoreCollections();
      
      if (result.success) {
        setStatus('success');
        setMessage(`✅ ¡Colecciones creadas exitosamente!
          - ${result.data.patients} pacientes
          - ${result.data.appointments} citas  
          - ${result.data.medicalHistory} registros médicos`);
        await checkStatus(); // Actualizar estado
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    } catch (error) {
      setStatus('error');
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCollections = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const result = await clearAllCollections();
      
      if (result.success) {
        setStatus('success');
        setMessage('🗑️ Colecciones limpiadas exitosamente');
        await checkStatus(); // Actualizar estado
      } else {
        setStatus('warning');
        setMessage(result.message);
      }
    } catch (error) {
      setStatus('error');
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getCollectionIcon = (collectionName) => {
    switch (collectionName) {
      case 'patients': return <Users size={24} className="text-sky-500" />;
      case 'appointments': return <Calendar size={24} className="text-purple-500" />;
      case 'medicalHistory': return <FileText size={24} className="text-emerald-500" />;
      default: return <Database size={24} className="text-gray-500" />;
    }
  };

  const getCollectionDisplayName = (collectionName) => {
    const names = {
      'patients': 'Pacientes',
      'appointments': 'Citas',
      'medicalHistory': 'Historial Médico'
    };
    return names[collectionName] || collectionName;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-sky-500 to-cyan-500 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Database size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Gestión de Colecciones Firestore
          </h1>
          <p className="text-gray-600">
            Administra las colecciones de tu base de datos
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Estado de la Base de Datos</h2>
            <button
              onClick={checkStatus}
              disabled={loading}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-xl transition-all duration-300 disabled:opacity-50"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* Collections Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {Object.entries(collections).map(([collectionName, info]) => (
              <div key={collectionName} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  {getCollectionIcon(collectionName)}
                  <h3 className="font-bold text-gray-800">
                    {getCollectionDisplayName(collectionName)}
                  </h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estado:</span>
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle size={16} />
                      Activa
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Documentos:</span>
                    <span className="font-semibold text-gray-800">
                      {info.documentCount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-xl mb-6 ${
              status === 'success' ? 'bg-green-100 border border-green-300 text-green-700' :
              status === 'error' ? 'bg-red-100 border border-red-300 text-red-700' :
              'bg-yellow-100 border border-yellow-300 text-yellow-700'
            }`}>
              <div className="flex items-start gap-2">
                {status === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                <div className="whitespace-pre-line">{message}</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleCreateCollections}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-sky-500 to-cyan-500 text-white py-4 rounded-xl hover:from-sky-600 hover:to-cyan-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Crear/Agregar Datos de Ejemplo
                </>
              )}
            </button>

            <button
              onClick={() => window.open('https://console.firebase.google.com/', '_blank')}
              className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-4 rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <Database size={20} />
              Abrir Firebase Console
            </button>

            <button
              onClick={handleClearCollections}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              <Trash2 size={20} />
              Limpiar Todo
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Play size={24} className="text-sky-500" />
            Instrucciones
          </h3>
          <div className="space-y-4 text-gray-600">
            <div className="flex items-start gap-3">
              <span className="bg-sky-100 text-sky-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
              <p><strong>Crear datos de ejemplo:</strong> Haz clic en "Crear/Agregar Datos de Ejemplo" para poblar tu base de datos con pacientes, citas e historial médico de muestra.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-sky-100 text-sky-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
              <p><strong>Verificar en Firebase:</strong> Usa "Abrir Firebase Console" para ver los datos directamente en Firebase y gestionar las reglas de seguridad.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-sky-100 text-sky-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
              <p><strong>Limpiar datos:</strong> Si necesitas empezar de nuevo, usa "Limpiar Todo" (¡cuidado! esto elimina todos los datos).</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-sky-100 text-sky-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</span>
              <p><strong>Actualizar estado:</strong> Usa el botón de refrescar para verificar el estado actual de tus colecciones.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionManager;
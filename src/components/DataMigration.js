import React, { useState } from 'react';
import { Database, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { migrateInitialData, checkIfDataExists } from '../utils/migration';

const DataMigration = ({ onMigrationComplete }) => {
  const [migrating, setMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState('pending'); // pending, success, error
  const [message, setMessage] = useState('');

  const handleMigration = async () => {
    setMigrating(true);
    setMigrationStatus('pending');
    setMessage('Verificando datos existentes...');

    try {
      // Verificar si ya existen datos
      const dataExists = await checkIfDataExists();
      
      if (dataExists) {
        setMessage('Ya existen datos en Firebase. ¿Deseas continuar? Esto duplicará los datos.');
        const confirmMigration = window.confirm('Ya existen datos en Firebase. ¿Deseas continuar con la migración?');
        
        if (!confirmMigration) {
          setMigrating(false);
          return;
        }
      }

      setMessage('Migrando pacientes y citas...');
      const success = await migrateInitialData();

      if (success) {
        setMigrationStatus('success');
        setMessage('¡Migración completada exitosamente!');
        setTimeout(() => {
          if (onMigrationComplete) {
            onMigrationComplete();
          }
        }, 2000);
      } else {
        setMigrationStatus('error');
        setMessage('Error durante la migración. Revisa la consola para más detalles.');
      }
    } catch (error) {
      setMigrationStatus('error');
      setMessage(`Error: ${error.message}`);
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50">
      <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4">
        <div className="text-center">
          <div className="bg-sky-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Database size={40} className="text-sky-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Configuración inicial
          </h2>
          
          <p className="text-gray-600 mb-6">
            Para comenzar a usar la aplicación, necesitamos migrar los datos de ejemplo a Firebase.
          </p>

          {migrationStatus === 'pending' && (
            <button
              onClick={handleMigration}
              disabled={migrating}
              className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 text-white py-4 rounded-xl hover:from-sky-600 hover:to-cyan-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {migrating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Migrando...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Migrar datos iniciales
                </>
              )}
            </button>
          )}

          {migrationStatus === 'success' && (
            <div className="text-center">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <p className="text-green-600 font-semibold">¡Migración exitosa!</p>
            </div>
          )}

          {migrationStatus === 'error' && (
            <div className="text-center">
              <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
              <p className="text-red-600 font-semibold">Error en la migración</p>
              <button
                onClick={handleMigration}
                className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Reintentar
              </button>
            </div>
          )}

          {message && (
            <p className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {message}
            </p>
          )}

          <div className="mt-6 text-xs text-gray-400">
            <p>Esta acción creará:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>3 pacientes de ejemplo</li>
              <li>3 citas de muestra</li>
              <li>Estructura de datos en Firestore</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataMigration;
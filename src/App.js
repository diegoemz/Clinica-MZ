import React, { useState, useEffect } from 'react';
import './App.css';

// Importar providers y hooks
import { AuthProvider } from './hooks/useAuth';
import { useFirebase } from './hooks/useFirebase';

// Importar componentes
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import PatientsView from './components/PatientsView';
import AvailabilityView from './components/AvailabilityView';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import DataMigration from './components/DataMigration';
import ProtectedRoute from './components/ProtectedRoute';
import CollectionManager from './components/CollectionManager';

import { checkIfDataExists } from './utils/migration';

// Componente principal de la aplicación
const ClinicApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [doctorName] = useState('Dra. Marcela de Morales');
  const [needsMigration, setNeedsMigration] = useState(null);
  const [showCollectionManager, setShowCollectionManager] = useState(false);
  
  // Usar hook de Firebase
  const {
    patients,
    appointments,
    loading,
    error,
    addPatient,
    editPatient,
    removePatient,
    getPatientById,
    addAppointment,
    editAppointment,
    removeAppointment,
    getAppointmentsByDate,
    getAppointmentsByPatientId,
    getStats,
    reload
  } = useFirebase();

  // Verificar si necesita migración al cargar
  useEffect(() => {
    const checkMigrationNeeded = async () => {
      try {
        const dataExists = await checkIfDataExists();
        
        if (!dataExists) {
          setShowCollectionManager(true);
          setNeedsMigration(false);
        } else {
          setNeedsMigration(false);
          setShowCollectionManager(false);
        }
      } catch (err) {
        console.error('Error checking migration status:', err);
        setShowCollectionManager(true);
        setNeedsMigration(false);
      }
    };

    if (!loading && needsMigration === null) {
      checkMigrationNeeded();
    }
  }, [loading, needsMigration]);

  // Props comunes para pasar a los componentes
  const commonProps = {
    appointments,
    patients,
    selectedDate,
    setSelectedDate,
    doctorName,
    loading,
    error,
    addPatient,
    editPatient,
    removePatient,
    getPatientById,
    addAppointment,
    editAppointment,
    removeAppointment,
    getAppointmentsByDate,
    getAppointmentsByPatientId,
    getStats,
    reload
  };

  const handleMigrationComplete = () => {
    setNeedsMigration(false);
    setShowCollectionManager(false);
    reload();
  };

  const handleCollectionManagerClose = () => {
    setShowCollectionManager(false);
    reload();
  };

  const renderActiveComponent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-red-200 max-w-md">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error de Conexión</h2>
            <p className="text-gray-600 mb-6 text-sm">{error}</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={reload}
                className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-6 py-3 rounded-xl hover:from-sky-600 hover:to-cyan-600 transition-all duration-300"
              >
                Reintentar
              </button>
              <button
                onClick={() => setShowCollectionManager(true)}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300"
              >
                Gestionar Base de Datos
              </button>
            </div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard {...commonProps} />;
      case 'calendar':
        return <CalendarView {...commonProps} />;
      case 'patients':
        return <PatientsView {...commonProps} />;
      case 'availability':
        return <AvailabilityView {...commonProps} />;
      default:
        return <Dashboard {...commonProps} />;
    }
  };

  // Mostrar gestor de colecciones si es necesario
  if (showCollectionManager) {
    return (
      <div className="relative">
        <CollectionManager />
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={handleCollectionManagerClose}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
          >
            ✅ Continuar a la App
          </button>
        </div>
      </div>
    );
  }

  if (needsMigration === true) {
    return <DataMigration onMigrationComplete={handleMigrationComplete} />;
  }

  if (needsMigration === null) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50">
      <Header doctorName={doctorName} />
      
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {renderActiveComponent()}
        
        <div className="fixed bottom-8 left-8 z-40">
          <button
            onClick={() => setShowCollectionManager(true)}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            title="Gestionar Base de Datos"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 7V4C4 3.44772 4.44772 3 5 3H19C19.5523 3 20 3.44772 20 4V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M4 11V14C4 14.5523 4.44772 15 5 15H19C19.5523 15 20 14.5523 20 14V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M4 18V21C4 21.5523 4.44772 22 5 22H19C19.5523 22 20 21.5523 20 21V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </main>

      <Footer doctorName={doctorName} />
    </div>
  );
};

// Componente raíz con providers
const ElegantClinicApp = () => {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <ClinicApp />
      </ProtectedRoute>
    </AuthProvider>
  );
};

export default ElegantClinicApp;
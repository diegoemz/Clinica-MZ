// hooks/useFirebase.js - Versión corregida
import { useState, useEffect } from 'react';
import {
  getPatients,
  getAppointments,
  createPatient,
  createAppointment,
  updatePatient,
  updateAppointment,
  deletePatient,
  deleteAppointment,
  subscribeToPatients,
  subscribeToAppointments,
  getDashboardStats,
  getAppointmentsByDate as getAppointmentsByDateService,
  getAppointmentsByPatient as getAppointmentsByPatientService
} from '../services/firebaseServices';

export const useFirebase = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    const unsubscribePatients = subscribeToPatients((updatedPatients) => {
      console.log('📥 Pacientes actualizados:', updatedPatients.length);
      setPatients(updatedPatients);
    });

    const unsubscribeAppointments = subscribeToAppointments((updatedAppointments) => {
      console.log('📥 Citas actualizadas:', updatedAppointments.length);
      setAppointments(updatedAppointments);
    });

    // Cleanup subscriptions
    return () => {
      unsubscribePatients();
      unsubscribeAppointments();
    };
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Cargando datos iniciales...');
      
      const [patientsData, appointmentsData] = await Promise.all([
        getPatients(),
        getAppointments()
      ]);
      
      console.log('✅ Datos cargados:', {
        pacientes: patientsData.length,
        citas: appointmentsData.length
      });
      
      setPatients(patientsData);
      setAppointments(appointmentsData);
    } catch (err) {
      const errorMessage = err.message || 'Error desconocido';
      console.error('❌ Error loading initial data:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Funciones para pacientes
  const addPatient = async (patientData) => {
    try {
      console.log('➕ Creando paciente:', patientData.name);
      const colors = [
        'bg-gradient-to-br from-sky-100 to-cyan-100',
        'bg-gradient-to-br from-purple-100 to-indigo-100',
        'bg-gradient-to-br from-emerald-100 to-teal-100',
        'bg-gradient-to-br from-amber-100 to-orange-100',
        'bg-gradient-to-br from-blue-100 to-cyan-100'
      ];

      const newPatientData = {
        ...patientData,
        profileColor: colors[Math.floor(Math.random() * colors.length)],
        medicalHistory: [],
        lastVisit: null,
        nextAppointment: null
      };

      const newPatient = await createPatient(newPatientData);
      console.log('✅ Paciente creado exitosamente:', newPatient.id);
      return newPatient;
    } catch (err) {
      const errorMessage = err.message || 'Error creando paciente';
      console.error('❌ Error creating patient:', err);
      setError(errorMessage);
      throw err;
    }
  };

  const editPatient = async (patientId, patientData) => {
    try {
      console.log('✏️ Editando paciente:', patientId);
      const updatedPatient = await updatePatient(patientId, patientData);
      console.log('✅ Paciente editado exitosamente');
      return updatedPatient;
    } catch (err) {
      const errorMessage = err.message || 'Error editando paciente';
      console.error('❌ Error editing patient:', err);
      setError(errorMessage);
      throw err;
    }
  };

  const removePatient = async (patientId) => {
    try {
      console.log('🗑️ Eliminando paciente:', patientId);
      await deletePatient(patientId);
      console.log('✅ Paciente eliminado exitosamente');
      return patientId;
    } catch (err) {
      const errorMessage = err.message || 'Error eliminando paciente';
      console.error('❌ Error removing patient:', err);
      setError(errorMessage);
      throw err;
    }
  };

  // Funciones para citas
  const addAppointment = async (appointmentData) => {
    try {
      console.log('➕ Creando cita:', appointmentData.type);
      const newAppointmentData = {
        ...appointmentData,
        patientId: String(appointmentData.patientId),
        status: 'confirmada'
      };

      const newAppointment = await createAppointment(newAppointmentData);
      console.log('✅ Cita creada exitosamente:', newAppointment.id);
      return newAppointment;
    } catch (err) {
      const errorMessage = err.message || 'Error creando cita';
      console.error('❌ Error creating appointment:', err);
      setError(errorMessage);
      throw err;
    }
  };

  const editAppointment = async (appointmentId, appointmentData) => {
    try {
      console.log('✏️ Editando cita:', appointmentId);
      const updatedAppointment = await updateAppointment(appointmentId, appointmentData);
      console.log('✅ Cita editada exitosamente');
      return updatedAppointment;
    } catch (err) {
      const errorMessage = err.message || 'Error editando cita';
      console.error('❌ Error editing appointment:', err);
      setError(errorMessage);
      throw err;
    }
  };

  const removeAppointment = async (appointmentId) => {
    try {
      console.log('🗑️ Eliminando cita:', appointmentId);
      await deleteAppointment(appointmentId);
      console.log('✅ Cita eliminada exitosamente');
      return appointmentId;
    } catch (err) {
      const errorMessage = err.message || 'Error eliminando cita';
      console.error('❌ Error removing appointment:', err);
      setError(errorMessage);
      throw err;
    }
  };

  // Funciones de utilidad
  const getPatientById = (patientId) => {
    return patients.find(patient => patient.id === patientId);
  };

  const getAppointmentsByDate = (date) => {
    return appointments
      .filter(apt => apt.date === date)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const getAppointmentsByPatientId = (patientId) => {
    return appointments
      .filter(apt => apt.patientId === patientId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const getStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = getAppointmentsByDate(today);
    const thisWeek = appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      return aptDate >= weekStart;
    });

    return {
      todayAppointments: todayAppointments.length,
      totalPatients: patients.length,
      weekAppointments: thisWeek.length,
      pendingAppointments: appointments.filter(apt => apt.status === 'pendiente').length
    };
  };

  // Función para limpiar errores
  const clearError = () => {
    setError(null);
  };

  return {
    // Estado
    patients,
    appointments,
    loading,
    error,
    
    // Funciones de pacientes (nombres corregidos)
    addPatient,        // ✅ Ahora coincide con createPatient
    editPatient,
    removePatient,
    getPatientById,
    
    // Funciones de citas (nombres corregidos)
    addAppointment,    // ✅ Ahora coincide con createAppointment
    editAppointment,
    removeAppointment,
    getAppointmentsByDate,
    getAppointmentsByPatientId,
    
    // Utilidades
    getStats,
    clearError,
    
    // Funciones de recarga
    reload: loadInitialData
  };
};
// services/firebaseServices.js
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config';

// ===================
// SERVICIOS DE PACIENTES
// ===================

// Crear nuevo paciente
export const createPatient = async (patientData) => {
  try {
    const docRef = await addDoc(collection(db, 'patients'), {
      ...patientData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...patientData };
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
};

// Obtener todos los pacientes
export const getPatients = async () => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'patients'), orderBy('name'))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting patients:', error);
    throw error;
  }
};

// Actualizar paciente
export const updatePatient = async (patientId, patientData) => {
  try {
    const patientRef = doc(db, 'patients', patientId);
    await updateDoc(patientRef, {
      ...patientData,
      updatedAt: new Date()
    });
    return { id: patientId, ...patientData };
  } catch (error) {
    console.error('Error updating patient:', error);
    throw error;
  }
};

// Eliminar paciente
export const deletePatient = async (patientId) => {
  try {
    await deleteDoc(doc(db, 'patients', patientId));
    return patientId;
  } catch (error) {
    console.error('Error deleting patient:', error);
    throw error;
  }
};

// Escuchar cambios en pacientes en tiempo real
export const subscribeToPatients = (callback) => {
  const q = query(collection(db, 'patients'), orderBy('name'));
  return onSnapshot(q, (querySnapshot) => {
    const patients = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(patients);
  });
};

// ===================
// SERVICIOS DE CITAS
// ===================

// Crear nueva cita
export const createAppointment = async (appointmentData) => {
  try {
    const docRef = await addDoc(collection(db, 'appointments'), {
      ...appointmentData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...appointmentData };
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

// Obtener todas las citas
export const getAppointments = async () => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'appointments'), orderBy('date'), orderBy('time'))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting appointments:', error);
    throw error;
  }
};

// Obtener citas por fecha
export const getAppointmentsByDate = async (date) => {
  try {
    const q = query(
      collection(db, 'appointments'),
      where('date', '==', date),
      orderBy('time')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting appointments by date:', error);
    throw error;
  }
};

// Obtener citas por paciente
export const getAppointmentsByPatient = async (patientId) => {
  try {
    const q = query(
      collection(db, 'appointments'),
      where('patientId', '==', patientId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting appointments by patient:', error);
    throw error;
  }
};

// Actualizar cita
export const updateAppointment = async (appointmentId, appointmentData) => {
  try {
    const appointmentRef = doc(db, 'appointments', appointmentId);
    await updateDoc(appointmentRef, {
      ...appointmentData,
      updatedAt: new Date()
    });
    return { id: appointmentId, ...appointmentData };
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
};

// Eliminar cita
export const deleteAppointment = async (appointmentId) => {
  try {
    await deleteDoc(doc(db, 'appointments', appointmentId));
    return appointmentId;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
};

// Escuchar cambios en citas en tiempo real
export const subscribeToAppointments = (callback) => {
  const q = query(collection(db, 'appointments'), orderBy('date'), orderBy('time'));
  return onSnapshot(q, (querySnapshot) => {
    const appointments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(appointments);
  });
};

// ===================
// SERVICIOS DE HISTORIAL MÉDICO
// ===================

// Agregar entrada al historial médico
export const addMedicalHistoryEntry = async (patientId, entry) => {
  try {
    const docRef = await addDoc(collection(db, 'medicalHistory'), {
      patientId,
      ...entry,
      createdAt: new Date()
    });
    return { id: docRef.id, patientId, ...entry };
  } catch (error) {
    console.error('Error adding medical history entry:', error);
    throw error;
  }
};

// Obtener historial médico de un paciente
export const getMedicalHistory = async (patientId) => {
  try {
    const q = query(
      collection(db, 'medicalHistory'),
      where('patientId', '==', patientId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting medical history:', error);
    throw error;
  }
};

// ===================
// UTILIDADES
// ===================

// Buscar pacientes por nombre, email o teléfono
export const searchPatients = async (searchTerm) => {
  try {
    const patients = await getPatients();
    return patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
    );
  } catch (error) {
    console.error('Error searching patients:', error);
    throw error;
  }
};

// Obtener estadísticas del dashboard
export const getDashboardStats = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const [allAppointments, allPatients] = await Promise.all([
      getAppointments(),
      getPatients()
    ]);

    const todayAppointments = allAppointments.filter(apt => apt.date === today);
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekAppointments = allAppointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate >= weekStart;
    });
    const pendingAppointments = allAppointments.filter(apt => apt.status === 'pendiente');

    return {
      todayAppointments: todayAppointments.length,
      totalPatients: allPatients.length,
      weekAppointments: weekAppointments.length,
      pendingAppointments: pendingAppointments.length
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }
};
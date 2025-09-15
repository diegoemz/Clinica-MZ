// utils/migration.js - Versión corregida
import { 
  createPatient, 
  createAppointment, 
  getPatients, 
  getAppointments 
} from '../services/firebaseServices';
import { initialPatients, initialAppointments } from '../data/initialData';

// Función para migrar datos iniciales a Firebase
export const migrateInitialData = async () => {
  try {
    console.log('🚀 Iniciando migración de datos...');
    
    // Migrar pacientes
    const migratedPatients = [];
    console.log('👥 Migrando pacientes...');
    
    for (const patient of initialPatients) {
      const { id, ...patientData } = patient; // Remover ID local
      console.log(`➕ Creando paciente: ${patient.name}`);
      const newPatient = await createPatient(patientData);
      migratedPatients.push(newPatient);
      console.log(`✅ Paciente migrado: ${patient.name} (ID: ${newPatient.id})`);
    }
    
    // Crear mapeo de IDs antiguos a nuevos
    const patientIdMap = {};
    initialPatients.forEach((oldPatient, index) => {
      patientIdMap[oldPatient.id] = migratedPatients[index].id;
    });
    
    console.log('📅 Migrando citas...');
    
    // Migrar citas con nuevos IDs de pacientes
    for (const appointment of initialAppointments) {
      const { id, patientId, ...appointmentData } = appointment;
      const newPatientId = patientIdMap[patientId];
      
      if (newPatientId) {
        console.log(`➕ Creando cita: ${appointment.type} para paciente ${newPatientId}`);
        const newAppointment = await createAppointment({
          ...appointmentData,
          patientId: newPatientId
        });
        console.log(`✅ Cita migrada: ${appointment.type} (ID: ${newAppointment.id})`);
      } else {
        console.warn(`⚠️ No se encontró paciente para cita: ${appointment.type}`);
      }
    }
    
    console.log('🎉 Migración completada exitosamente');
    console.log(`📊 Resumen:
      - ${migratedPatients.length} pacientes migrados
      - ${initialAppointments.length} citas migradas
    `);
    
    return true;
  } catch (error) {
    console.error('❌ Error en la migración:', error);
    throw error;
  }
};

// Función para verificar si ya existen datos
export const checkIfDataExists = async () => {
  try {
    console.log('🔍 Verificando datos existentes...');
    const [patients, appointments] = await Promise.all([
      getPatients(),
      getAppointments()
    ]);
    
    const dataExists = patients.length > 0 || appointments.length > 0;
    console.log(`📊 Datos encontrados: ${patients.length} pacientes, ${appointments.length} citas`);
    
    return dataExists;
  } catch (error) {
    console.error('❌ Error verificando datos existentes:', error);
    throw error;
  }
};
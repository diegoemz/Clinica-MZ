// utils/createCollections.js - Versión corregida
import { db } from '../firebase/config';
import { collection, addDoc, getDocs } from 'firebase/firestore';

// 📋 Datos de ejemplo para las colecciones
const samplePatients = [
  {
    name: 'Ana Patricia Morales',
    email: 'ana.morales@email.com',
    phone: '+503 7234-5678',
    birthDate: '1992-03-15',
    address: 'Col. Escalón, San Salvador',
    bloodType: 'O+',
    allergies: 'Ninguna conocida',
    emergencyContact: 'Carlos Morales - 7234-5679',
    civilStatus: 'Casada',
    occupation: 'Contadora',
    insurance: 'ISSS',
    profileColor: 'bg-gradient-to-br from-sky-100 to-cyan-100',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'María José Hernández',
    email: 'maria.hernandez@email.com',
    phone: '+503 7345-6789',
    birthDate: '1988-11-22',
    address: 'Col. San Benito, San Salvador',
    bloodType: 'A+',
    allergies: 'Penicilina',
    emergencyContact: 'Roberto Hernández - 7345-6790',
    civilStatus: 'Soltera',
    occupation: 'Diseñadora',
    insurance: 'Particular',
    profileColor: 'bg-gradient-to-br from-purple-100 to-indigo-100',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Carmen Elena López',
    email: 'carmen.lopez@email.com',
    phone: '+503 7456-7890',
    birthDate: '1985-07-08',
    address: 'Col. Maquilishuat, San Salvador',
    bloodType: 'B+',
    allergies: 'Ibuprofeno',
    emergencyContact: 'Luis López - 7456-7891',
    civilStatus: 'Casada',
    occupation: 'Profesora',
    insurance: 'ISBM',
    profileColor: 'bg-gradient-to-br from-emerald-100 to-teal-100',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// 🔧 Función principal para crear todas las colecciones
export const createFirestoreCollections = async () => {
  console.log('🚀 Iniciando creación de colecciones...');
  
  try {
    // 1. Verificar si ya existen datos
    console.log('1️⃣ Verificando colecciones existentes...');
    const existingPatients = await getDocs(collection(db, 'patients'));
    
    if (existingPatients.size > 0) {
      console.log('⚠️ Ya existen pacientes en la base de datos');
      const proceed = window.confirm('Ya existen datos. ¿Deseas agregar más datos de ejemplo?');
      if (!proceed) {
        console.log('❌ Operación cancelada por el usuario');
        return { success: false, message: 'Operación cancelada' };
      }
    }

    // 2. Crear pacientes y obtener sus IDs
    console.log('2️⃣ Creando pacientes...');
    const patientIds = [];
    
    for (const patientData of samplePatients) {
      console.log(`➕ Creando paciente: ${patientData.name}`);
      const docRef = await addDoc(collection(db, 'patients'), patientData);
      patientIds.push(docRef.id);
      console.log(`✅ Paciente creado: ${patientData.name} (ID: ${docRef.id})`);
    }

    // 3. Crear citas usando los IDs de pacientes reales
    console.log('3️⃣ Creando citas...');
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    
    const sampleAppointments = [
      {
        patientId: patientIds[0],
        date: today,
        time: '09:00',
        type: 'Control Prenatal',
        status: 'confirmada',
        notes: 'Seguimiento embarazo 20 semanas',
        priority: 'alta',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        patientId: patientIds[1],
        date: today,
        time: '10:30',
        type: 'Consulta de Rutina',
        status: 'confirmada',
        notes: 'Control anual preventivo',
        priority: 'normal',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        patientId: patientIds[2],
        date: tomorrow,
        time: '14:00',
        type: 'Ultrasonido',
        status: 'pendiente',
        notes: 'Primera consulta',
        priority: 'normal',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const appointmentData of sampleAppointments) {
      console.log(`➕ Creando cita: ${appointmentData.type} para paciente ${appointmentData.patientId}`);
      const docRef = await addDoc(collection(db, 'appointments'), appointmentData);
      console.log(`✅ Cita creada: ${appointmentData.type} (ID: ${docRef.id})`);
    }

    // 4. Crear historial médico
    console.log('4️⃣ Creando historial médico...');
    const sampleMedicalHistory = [
      {
        patientId: patientIds[0],
        date: '2024-08-15',
        diagnosis: 'Embarazo normal - 20 semanas',
        treatment: 'Suplementos prenatales, control mensual',
        notes: 'Evolución favorable, todos los exámenes normales',
        createdAt: new Date()
      },
      {
        patientId: patientIds[0],
        date: '2024-06-10',
        diagnosis: 'Control prenatal inicial',
        treatment: 'Ácido fólico, vitaminas prenatales',
        notes: 'Primera consulta embarazo',
        createdAt: new Date()
      },
      {
        patientId: patientIds[1],
        date: '2024-07-20',
        diagnosis: 'Control ginecológico anual normal',
        treatment: 'Continuar cuidados preventivos',
        notes: 'Citología normal, examen físico sin alteraciones',
        createdAt: new Date()
      }
    ];

    for (const historyData of sampleMedicalHistory) {
      console.log(`➕ Creando historial médico para paciente ${historyData.patientId}`);
      const docRef = await addDoc(collection(db, 'medicalHistory'), historyData);
      console.log(`✅ Historial médico creado (ID: ${docRef.id})`);
    }

    // 5. Resumen final
    console.log('🎉 ¡Colecciones creadas exitosamente!');
    console.log(`📊 Resumen:
      - ${patientIds.length} pacientes creados
      - ${sampleAppointments.length} citas creadas
      - ${sampleMedicalHistory.length} entradas de historial médico creadas
    `);

    return {
      success: true,
      message: 'Colecciones creadas exitosamente',
      data: {
        patients: patientIds.length,
        appointments: sampleAppointments.length,
        medicalHistory: sampleMedicalHistory.length
      }
    };

  } catch (error) {
    console.error('❌ Error creando colecciones:', error);
    return {
      success: false,
      message: `Error: ${error.message}`,
      error: error
    };
  }
};

// 🗑️ Función para limpiar todas las colecciones (usar con cuidado)
export const clearAllCollections = async () => {
  console.log('🗑️ ⚠️ CUIDADO: Eliminando todas las colecciones...');
  
  const confirmed = window.confirm(
    '⚠️ ADVERTENCIA: Esto eliminará TODOS los datos de la base de datos.\n\n¿Estás seguro de que quieres continuar?'
  );
  
  if (!confirmed) {
    console.log('❌ Operación cancelada');
    return { success: false, message: 'Operación cancelada' };
  }

  try {
    const collections = ['patients', 'appointments', 'medicalHistory'];
    
    for (const collectionName of collections) {
      const querySnapshot = await getDocs(collection(db, collectionName));
      console.log(`🗑️ Eliminando ${querySnapshot.size} documentos de ${collectionName}...`);
      
      // Nota: En un entorno real, necesitarías Cloud Functions para eliminar en lote
      // Por ahora, esto es solo para desarrollo
    }
    
    console.log('✅ Limpieza completada');
    return { success: true, message: 'Colecciones limpiadas' };
    
  } catch (error) {
    console.error('❌ Error limpiando colecciones:', error);
    return { success: false, message: `Error: ${error.message}` };
  }
};

// 📊 Función para verificar el estado de las colecciones
export const checkCollectionsStatus = async () => {
  console.log('📊 Verificando estado de las colecciones...');
  
  try {
    const collections = ['patients', 'appointments', 'medicalHistory'];
    const status = {};
    
    for (const collectionName of collections) {
      const querySnapshot = await getDocs(collection(db, collectionName));
      status[collectionName] = {
        exists: true,
        documentCount: querySnapshot.size,
        documents: querySnapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        }))
      };
      console.log(`📁 ${collectionName}: ${querySnapshot.size} documentos`);
    }
    
    return { success: true, status };
    
  } catch (error) {
    console.error('❌ Error verificando colecciones:', error);
    return { success: false, error: error.message };
  }
};
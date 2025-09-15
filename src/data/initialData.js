export const initialAppointments = [
  {
    id: 1,
    patientId: 1,
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    type: 'Control Prenatal',
    status: 'confirmada',
    notes: 'Seguimiento embarazo 20 semanas',
    priority: 'alta'
  },
  {
    id: 2,
    patientId: 2,
    date: new Date().toISOString().split('T')[0],
    time: '10:30',
    type: 'Consulta de Rutina',
    status: 'confirmada',
    notes: 'Control anual preventivo',
    priority: 'normal'
  },
  {
    id: 3,
    patientId: 3,
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '14:00',
    type: 'Ultrasonido',
    status: 'pendiente',
    notes: 'Primera consulta',
    priority: 'normal'
  }
];

export const initialPatients = [
  {
    id: 1,
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
    medicalHistory: [
      { 
        date: '2024-08-15', 
        diagnosis: 'Embarazo normal - 20 semanas', 
        treatment: 'Suplementos prenatales, control mensual',
        notes: 'Evolución favorable, todos los exámenes normales'
      },
      { 
        date: '2024-06-10', 
        diagnosis: 'Control prenatal inicial', 
        treatment: 'Ácido fólico, vitaminas prenatales',
        notes: 'Primera consulta embarazo'
      }
    ],
    lastVisit: '2024-08-15',
    nextAppointment: new Date().toISOString().split('T')[0],
    insurance: 'ISSS',
    profileColor: 'bg-gradient-to-br from-sky-100 to-cyan-100'
  },
  {
    id: 2,
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
    medicalHistory: [
      { 
        date: '2024-07-20', 
        diagnosis: 'Control ginecológico anual normal', 
        treatment: 'Continuar cuidados preventivos',
        notes: 'Citología normal, examen físico sin alteraciones'
      }
    ],
    lastVisit: '2024-07-20',
    nextAppointment: '2025-07-20',
    insurance: 'Particular',
    profileColor: 'bg-gradient-to-br from-purple-100 to-indigo-100'
  },
  {
    id: 3,
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
    medicalHistory: [],
    lastVisit: null,
    nextAppointment: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    insurance: 'ISBM',
    profileColor: 'bg-gradient-to-br from-emerald-100 to-teal-100'
  }
];

export const availableSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
];

export const appointmentTypes = [
  'Control Prenatal', 
  'Consulta de Rutina', 
  'Ultrasonido', 
  'Papanicolaou', 
  'Control Postparto',
  'Planificación Familiar',
  'Consulta Adolescente',
  'Control Menopausia'
];
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, FileText, Plus, Search, Edit, Save, X, Phone, Mail, MapPin, Users, Activity, Heart, Flower2, Sparkles, Bell, Camera } from 'lucide-react';
import './App.css';

const ElegantClinicApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [showPatientProfile, setShowPatientProfile] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [doctorName] = useState('Dra. Marcela de Morales'); // Nombre personalizable

  // Estados para datos
  const [appointments, setAppointments] = useState([
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
  ]);

  const [patients, setPatients] = useState([
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
      profileColor: 'bg-gradient-to-br from-pink-100 to-rose-100'
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
  ]);

  const [newAppointment, setNewAppointment] = useState({
    patientId: '',
    date: selectedDate,
    time: '',
    type: '',
    notes: '',
    priority: 'normal'
  });

  const [newPatient, setNewPatient] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    address: '',
    bloodType: '',
    allergies: '',
    emergencyContact: '',
    civilStatus: '',
    occupation: '',
    insurance: ''
  });

  // Horarios disponibles (personalizable para la doctora)
  const availableSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const appointmentTypes = [
    'Control Prenatal', 
    'Consulta de Rutina', 
    'Ultrasonido', 
    'Papanicolaou', 
    'Control Postparto',
    'Planificación Familiar',
    'Consulta Adolescente',
    'Control Menopausia'
  ];

  // Filtrar pacientes por búsqueda
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  // Obtener citas del día seleccionado
  const getDayAppointments = (date) => {
    return appointments.filter(apt => apt.date === date).sort((a, b) => a.time.localeCompare(b.time));
  };

  // Obtener estadísticas del dashboard
  const getStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = getDayAppointments(today);
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

  // Crear nueva cita
  const handleCreateAppointment = () => {
    if (newAppointment.patientId && newAppointment.time && newAppointment.type) {
      const appointment = {
        ...newAppointment,
        id: appointments.length + 1,
        status: 'confirmada'
      };
      setAppointments([...appointments, appointment]);
      setNewAppointment({
        patientId: '',
        date: selectedDate,
        time: '',
        type: '',
        notes: '',
        priority: 'normal'
      });
      setShowNewAppointment(false);
    }
  };

  // Crear nuevo paciente
  const handleCreatePatient = () => {
    if (newPatient.name && newPatient.email && newPatient.phone) {
      const colors = [
        'bg-gradient-to-br from-pink-100 to-rose-100',
        'bg-gradient-to-br from-purple-100 to-indigo-100',
        'bg-gradient-to-br from-emerald-100 to-teal-100',
        'bg-gradient-to-br from-amber-100 to-orange-100',
        'bg-gradient-to-br from-blue-100 to-cyan-100'
      ];
      
      const patient = {
        ...newPatient,
        id: patients.length + 1,
        medicalHistory: [],
        lastVisit: null,
        nextAppointment: null,
        profileColor: colors[Math.floor(Math.random() * colors.length)]
      };
      setPatients([...patients, patient]);
      setNewPatient({
        name: '',
        email: '',
        phone: '',
        birthDate: '',
        address: '',
        bloodType: '',
        allergies: '',
        emergencyContact: '',
        civilStatus: '',
        occupation: '',
        insurance: ''
      });
    }
  };

  // Dashboard Component
  const Dashboard = () => {
    const stats = getStats();
    const todayAppointments = getDayAppointments(new Date().toISOString().split('T')[0]);
    
    return (
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4">
            <Flower2 size={120} className="opacity-20" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">¡Buen día, {doctorName}!</h2>
            <p className="text-pink-100 text-lg">Tienes {stats.todayAppointments} citas programadas para hoy</p>
            <div className="flex items-center gap-2 mt-4">
              <Heart size={20} className="text-pink-200" />
              <span className="text-pink-100">Cuidando la salud femenina con amor y profesionalismo</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Citas de Hoy</p>
                <p className="text-3xl font-bold text-pink-600">{stats.todayAppointments}</p>
              </div>
              <div className="bg-pink-100 p-3 rounded-full">
                <Calendar size={24} className="text-pink-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Pacientes</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalPatients}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users size={24} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Esta Semana</p>
                <p className="text-3xl font-bold text-emerald-600">{stats.weekAppointments}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <Clock size={24} className="text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pendientes</p>
                <p className="text-3xl font-bold text-amber-600">{stats.pendingAppointments}</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <Bell size={24} className="text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <Sparkles className="text-pink-500" size={28} />
              Citas de Hoy
            </h3>
            <button
              onClick={() => setShowNewAppointment(true)}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Plus size={20} />
              Nueva Cita
            </button>
          </div>

          {todayAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {todayAppointments.map(appointment => {
                const patient = patients.find(p => p.id === appointment.patientId);
                return (
                  <div key={appointment.id} className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-pink-500 text-white p-2 rounded-full">
                          <Clock size={16} />
                        </div>
                        <span className="font-bold text-pink-800 text-lg">{appointment.time}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        appointment.priority === 'alta' ? 'bg-red-100 text-red-800' :
                        appointment.priority === 'media' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {appointment.priority}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-800 text-lg mb-2">{patient?.name}</h4>
                    <p className="text-pink-700 font-medium mb-2">{appointment.type}</p>
                    {appointment.notes && (
                      <p className="text-gray-600 text-sm italic">{appointment.notes}</p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Flower2 size={64} className="mx-auto mb-4 text-pink-300" />
              <p className="text-gray-500 text-lg">No hay citas programadas para hoy</p>
              <p className="text-gray-400">¡Perfecto día para descansar o ponerse al día!</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Calendar View Component (actualizado)
  const CalendarView = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Calendar className="text-pink-500" size={32} />
          Calendario de Citas
        </h2>
        <button
          onClick={() => setShowNewAppointment(true)}
          className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <Plus size={20} />
          Nueva Cita
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Seleccionar Fecha
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border-2 border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-400 transition-all duration-300"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getDayAppointments(selectedDate).map(appointment => {
            const patient = patients.find(p => p.id === appointment.patientId);
            return (
              <div key={appointment.id} className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-pink-500 text-white p-2 rounded-full">
                      <Clock size={16} />
                    </div>
                    <span className="font-bold text-pink-800 text-lg">{appointment.time}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    appointment.status === 'confirmada' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
                <h4 className="font-bold text-gray-800 text-lg mb-2">{patient?.name}</h4>
                <p className="text-pink-700 font-medium mb-2">{appointment.type}</p>
                {appointment.notes && (
                  <p className="text-gray-600 text-sm italic">{appointment.notes}</p>
                )}
              </div>
            );
          })}
        </div>

        {getDayAppointments(selectedDate).length === 0 && (
          <div className="text-center py-12">
            <Calendar size={64} className="mx-auto mb-4 text-pink-300" />
            <p className="text-gray-500 text-lg">No hay citas programadas para esta fecha</p>
          </div>
        )}
      </div>

      {/* Modal Nueva Cita - Diseño elegante */}
      {showNewAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <Sparkles className="text-pink-500" size={28} />
                Nueva Cita
              </h3>
              <button
                onClick={() => setShowNewAppointment(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Paciente</label>
                <select
                  value={newAppointment.patientId}
                  onChange={(e) => setNewAppointment({...newAppointment, patientId: parseInt(e.target.value)})}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-400 transition-all duration-300"
                >
                  <option value="">Seleccionar paciente</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>{patient.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha</label>
                  <input
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-400 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hora</label>
                  <select
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-400 transition-all duration-300"
                  >
                    <option value="">Seleccionar hora</option>
                    {availableSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Consulta</label>
                <select
                  value={newAppointment.type}
                  onChange={(e) => setNewAppointment({...newAppointment, type: e.target.value})}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-400 transition-all duration-300"
                >
                  <option value="">Seleccionar tipo</option>
                  {appointmentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Prioridad</label>
                <select
                  value={newAppointment.priority}
                  onChange={(e) => setNewAppointment({...newAppointment, priority: e.target.value})}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-400 transition-all duration-300"
                >
                  <option value="normal">Normal</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notas</label>
                <textarea
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-400 transition-all duration-300"
                  rows="3"
                  placeholder="Notas adicionales..."
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={handleCreateAppointment}
                className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Crear Cita
              </button>
              <button
                onClick={() => setShowNewAppointment(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Patients View Component (actualizado)
  const PatientsView = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Users className="text-pink-500" size={32} />
          Mis Pacientes
        </h2>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="mb-6">
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar pacientes por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-400 transition-all duration-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map(patient => (
            <div key={patient.id} className={`${patient.profileColor} border-2 border-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white bg-opacity-80 p-2 rounded-full">
                    <User size={20} className="text-gray-700" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">{patient.name}</h3>
                </div>
                <button
                  onClick={() => {
                    setSelectedPatient(patient);
                    setShowPatientProfile(true);
                  }}
                  className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-white hover:bg-opacity-50 transition-all duration-300"
                >
                  <FileText size={18} />
                </button>
              </div>
              
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Mail size={14} />
                  <span>{patient.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  <span className="truncate">{patient.address}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white border-opacity-50">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Última visita: {patient.lastVisit || 'Primera vez'}</span>
                  <span className="bg-white bg-opacity-60 px-2 py-1 rounded-full">{patient.bloodType}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <Users size={64} className="mx-auto mb-4 text-pink-300" />
            <p className="text-gray-500 text-lg">No se encontraron pacientes</p>
          </div>
        )}
      </div>

      {/* Modal Perfil de Paciente - Diseño elegante */}
      {showPatientProfile && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className={`${selectedPatient.profileColor} p-4 rounded-2xl`}>
                  <User size={32} className="text-gray-700" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-800">{selectedPatient.name}</h3>
                  <p className="text-gray-600">{selectedPatient.occupation}</p>
                </div>
              </div>
              <button
                onClick={() => setShowPatientProfile(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Información Personal */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100">
                  <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Heart className="text-pink-500" size={24} />
                    Información Personal
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre Completo</label>
                      <p className="text-gray-900 bg-white p-3 rounded-lg">{selectedPatient.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha de Nacimiento</label>
                      <p className="text-gray-900 bg-white p-3 rounded-lg">{selectedPatient.birthDate}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Estado Civil</label>
                      <p className="text-gray-900 bg-white p-3 rounded-lg">{selectedPatient.civilStatus}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Ocupación</label>
                      <p className="text-gray-900 bg-white p-3 rounded-lg">{selectedPatient.occupation}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                      <p className="text-gray-900 bg-white p-3 rounded-lg">{selectedPatient.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
                      <p className="text-gray-900 bg-white p-3 rounded-lg">{selectedPatient.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Dirección</label>
                      <p className="text-gray-900 bg-white p-3 rounded-lg">{selectedPatient.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información Médica */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {/* Datos Médicos */}
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
                    <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <Activity className="text-purple-500" size={24} />
                      Información Médica
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de Sangre</label>
                        <p className="text-gray-900 bg-white p-3 rounded-lg font-semibold">{selectedPatient.bloodType}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Seguro Médico</label>
                        <p className="text-gray-900 bg-white p-3 rounded-lg">{selectedPatient.insurance}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Alergias</label>
                        <p className="text-gray-900 bg-white p-3 rounded-lg">{selectedPatient.allergies}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Contacto de Emergencia</label>
                        <p className="text-gray-900 bg-white p-3 rounded-lg">{selectedPatient.emergencyContact}</p>
                      </div>
                    </div>
                  </div>

                  {/* Historial Médico */}
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                    <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <FileText className="text-emerald-500" size={24} />
                      Historial Médico
                    </h4>
                    <div className="space-y-4">
                      {selectedPatient.medicalHistory.length > 0 ? (
                        selectedPatient.medicalHistory.map((entry, index) => (
                          <div key={index} className="bg-white rounded-xl p-6 border border-emerald-200 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                              <span className="text-sm font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">{entry.date}</span>
                              <Activity size={16} className="text-emerald-600" />
                            </div>
                            <h5 className="font-bold text-gray-800 mb-2">Diagnóstico:</h5>
                            <p className="text-gray-700 mb-3 bg-gray-50 p-3 rounded-lg">{entry.diagnosis}</p>
                            <h5 className="font-bold text-gray-800 mb-2">Tratamiento:</h5>
                            <p className="text-gray-700 mb-3 bg-gray-50 p-3 rounded-lg">{entry.treatment}</p>
                            {entry.notes && (
                              <>
                                <h5 className="font-bold text-gray-800 mb-2">Notas:</h5>
                                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg italic">{entry.notes}</p>
                              </>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <FileText size={48} className="mx-auto mb-4 text-emerald-300" />
                          <p className="text-gray-500 text-lg">No hay historial médico registrado</p>
                          <p className="text-gray-400">Este será el primer registro de la paciente</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulario Nuevo Paciente - Diseño elegante */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
          <Plus className="text-pink-500" size={28} />
          Registrar Nueva Paciente
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre Completo*</label>
            <input
              type="text"
              value={newPatient.name}
              onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-400 transition-all duration-300"
              placeholder="Nombre completo"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email*</label>
            <input
              type="email"
              value={newPatient.email}
              onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-400 transition-all duration-300"
              placeholder="email@ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono*</label>
            <input
              type="tel"
              value={newPatient.phone}
              onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-400 transition-all duration-300"
              placeholder="+503 7234-5678"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha de Nacimiento</label>
            <input
              type="date"
              value={newPatient.birthDate}
              onChange={(e) => setNewPatient({...newPatient, birthDate: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-400 transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Estado Civil</label>
            <select
              value={newPatient.civilStatus}
              onChange={(e) => setNewPatient({...newPatient, civilStatus: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-400 transition-all duration-300"
            >
              <option value="">Seleccionar</option>
              <option value="Soltera">Soltera</option>
              <option value="Casada">Casada</option>
              <option value="Divorciada">Divorciada</option>
              <option value="Viuda">Viuda</option>
              <option value="Unión Libre">Unión Libre</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ocupación</label>
            <input
              type="text"
              value={newPatient.occupation}
              onChange={(e) => setNewPatient({...newPatient, occupation: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-400 transition-all duration-300"
              placeholder="Ocupación"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Sangre</label>
            <select
              value={newPatient.bloodType}
              onChange={(e) => setNewPatient({...newPatient, bloodType: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-400 transition-all duration-300"
            >
              <option value="">Seleccionar</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Seguro Médico</label>
            <select
              value={newPatient.insurance}
              onChange={(e) => setNewPatient({...newPatient, insurance: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-400 transition-all duration-300"
            >
              <option value="">Seleccionar</option>
              <option value="ISSS">ISSS</option>
              <option value="ISBM">ISBM</option>
              <option value="Particular">Particular</option>
              <option value="Seguro Privado">Seguro Privado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Alergias</label>
            <input
              type="text"
              value={newPatient.allergies}
              onChange={(e) => setNewPatient({...newPatient, allergies: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-400 transition-all duration-300"
              placeholder="Alergias conocidas"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Dirección</label>
            <input
              type="text"
              value={newPatient.address}
              onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-400 transition-all duration-300"
              placeholder="Dirección completa"
            />
          </div>
          <div className="lg:col-span-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Contacto de Emergencia</label>
            <input
              type="text"
              value={newPatient.emergencyContact}
              onChange={(e) => setNewPatient({...newPatient, emergencyContact: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-400 transition-all duration-300"
              placeholder="Nombre y teléfono del contacto de emergencia"
            />
          </div>
        </div>
        <div className="mt-8">
          <button
            onClick={handleCreatePatient}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
          >
            <Plus size={20} />
            Registrar Paciente
          </button>
        </div>
      </div>
    </div>
  );

  // Availability View Component (actualizado)
  const AvailabilityView = () => {
    const [weekOffset, setWeekOffset] = useState(0);

    // Generar fechas de la semana
    const getWeekDates = (offset = 0) => {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + (offset * 7));
      
      const dates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        dates.push(date);
      }
      return dates;
    };

    const weekDates = getWeekDates(weekOffset);
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    // Verificar si un slot está ocupado
    const isSlotBooked = (date, time) => {
      const dateString = date.toISOString().split('T')[0];
      return appointments.some(apt => 
        apt.date === dateString && 
        apt.time === time
      );
    };

    // Obtener paciente de una cita
    const getAppointmentPatient = (date, time) => {
      const dateString = date.toISOString().split('T')[0];
      const appointment = appointments.find(apt => 
        apt.date === dateString && 
        apt.time === time
      );
      if (appointment) {
        return patients.find(p => p.id === appointment.patientId);
      }
      return null;
    };

    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Clock className="text-pink-500" size={32} />
            Mi Agenda Semanal
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          {/* Navegación de semanas */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => setWeekOffset(weekOffset - 1)}
              className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-semibold"
            >
              ← Semana Anterior
            </button>
            <h3 className="text-xl font-bold text-gray-800">
              {weekDates[0].toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })} - {weekDates[6].toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </h3>
            <button
              onClick={() => setWeekOffset(weekOffset + 1)}
              className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-semibold"
            >
              Semana Siguiente →
            </button>
          </div>

          {/* Grid de disponibilidad */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-2 border-gray-200 p-4 bg-gradient-to-br from-pink-50 to-rose-50 font-bold text-gray-800 rounded-tl-xl">Hora</th>
                  {weekDates.map((date, index) => (
                    <th key={index} className={`border-2 border-gray-200 p-4 bg-gradient-to-br from-pink-50 to-rose-50 font-bold text-gray-800 min-w-40 ${index === 6 ? 'rounded-tr-xl' : ''}`}>
                      <div className="text-lg">{dayNames[date.getDay()]}</div>
                      <div className="text-sm font-normal text-gray-600">{date.getDate()}/{date.getMonth() + 1}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {availableSlots.map((time, timeIndex) => (
                  <tr key={time}>
                    <td className={`border-2 border-gray-200 p-4 font-bold bg-gradient-to-br from-pink-50 to-rose-50 text-gray-800 ${timeIndex === availableSlots.length - 1 ? 'rounded-bl-xl' : ''}`}>
                      {time}
                    </td>
                    {weekDates.map((date, dateIndex) => {
                      const isBooked = isSlotBooked(date, time);
                      const patient = getAppointmentPatient(date, time);
                      const isLastRow = timeIndex === availableSlots.length - 1;
                      const isLastCol = dateIndex === weekDates.length - 1;
                      
                      return (
                        <td key={dateIndex} className={`border-2 border-gray-200 p-2 ${isLastRow && isLastCol ? 'rounded-br-xl' : ''}`}>
                          <div className={`p-3 rounded-xl text-center transition-all duration-300 ${
                            isBooked
                              ? 'bg-gradient-to-br from-pink-100 to-rose-100 border-2 border-pink-200 hover:shadow-md'
                              : 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:bg-gradient-to-br hover:from-green-100 hover:to-emerald-100'
                          }`}>
                            {isBooked ? (
                              <div>
                                <div className="font-semibold text-pink-800 text-sm">Ocupado</div>
                                {patient && (
                                  <div className="text-xs text-pink-600 mt-1 truncate">
                                    {patient.name.split(' ')[0]} {patient.name.split(' ')[1]}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="font-semibold text-green-800 text-sm">Disponible</div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Leyenda */}
          <div className="mt-8 flex justify-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded"></div>
              <span className="text-gray-700 font-medium">Disponible</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gradient-to-br from-pink-100 to-rose-100 border-2 border-pink-200 rounded"></div>
              <span className="text-gray-700 font-medium">Ocupado</span>
            </div>
          </div>
        </div>

        {/* Resumen del día */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
            <Sparkles className="text-pink-500" size={28} />
            Resumen de Hoy
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="text-4xl font-bold text-blue-600">
                {getDayAppointments(new Date().toISOString().split('T')[0]).length}
              </div>
              <div className="text-sm font-semibold text-blue-800 mt-2">Citas de Hoy</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="text-4xl font-bold text-green-600">
                {availableSlots.length - getDayAppointments(new Date().toISOString().split('T')[0]).length}
              </div>
              <div className="text-sm font-semibold text-green-800 mt-2">Espacios Libres</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="text-4xl font-bold text-purple-600">
                {patients.length}
              </div>
              <div className="text-sm font-semibold text-purple-800 mt-2">Total Pacientes</div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="text-4xl font-bold text-amber-600">
                {appointments.filter(apt => apt.status === 'pendiente').length}
              </div>
              <div className="text-sm font-semibold text-amber-800 mt-2">Pendientes</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 text-white shadow-2xl relative overflow-hidden">
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
              <p className="text-pink-100 text-lg font-medium">{doctorName}</p>
              <p className="text-pink-200 mt-1">Cuidando tu salud femenina con dedicación y profesionalismo</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4">
                <Sparkles size={32} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-12">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-6 px-4 border-b-4 font-semibold text-lg transition-all duration-300 ${
                activeTab === 'dashboard'
                  ? 'border-pink-500 text-pink-600 bg-pink-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles size={24} />
                Dashboard
              </div>
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`py-6 px-4 border-b-4 font-semibold text-lg transition-all duration-300 ${
                activeTab === 'calendar'
                  ? 'border-pink-500 text-pink-600 bg-pink-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar size={24} />
                Calendario
              </div>
            </button>
            <button
              onClick={() => setActiveTab('patients')}
              className={`py-6 px-4 border-b-4 font-semibold text-lg transition-all duration-300 ${
                activeTab === 'patients'
                  ? 'border-pink-500 text-pink-600 bg-pink-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users size={24} />
                Mis Pacientes
              </div>
            </button>
            <button
              onClick={() => setActiveTab('availability')}
              className={`py-6 px-4 border-b-4 font-semibold text-lg transition-all duration-300 ${
                activeTab === 'availability'
                  ? 'border-pink-500 text-pink-600 bg-pink-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Clock size={24} />
                Mi Agenda
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'calendar' && <CalendarView />}
        {activeTab === 'patients' && <PatientsView />}
        {activeTab === 'availability' && <AvailabilityView />}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 text-white mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart size={24} className="text-pink-200" />
              <span className="text-lg font-semibold">{doctorName}</span>
              <Heart size={24} className="text-pink-200" />
            </div>
            <p className="text-pink-200">Cuidando la salud femenina con amor, dedicación y profesionalismo</p>
            <div className="mt-4 flex items-center justify-center gap-4 text-pink-200">
              <div className="flex items-center gap-1">
                <Phone size={16} />
                <span>+503 2XXX-XXXX</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail size={16} />
                <span>consultorio@email.com</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ElegantClinicApp;
import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Clock } from 'lucide-react';
import AppointmentCard from './AppointmentCard';
import NewAppointmentModal from './NewAppointmentModal';

const CalendarView = ({ 
  appointments, 
  patients, 
  selectedDate, 
  setSelectedDate,
  addAppointment  // ⚠️ Esta función debe venir de App.js
}) => {
  const [showNewAppointment, setShowNewAppointment] = useState(false);

  // 🔍 DEBUG: Verificar props recibidas
  useEffect(() => {
    console.log('🔍 CalendarView props:', {
      addAppointment: typeof addAppointment,
      appointments: appointments?.length,
      patients: patients?.length,
      selectedDate
    });
    
    if (!addAppointment) {
      console.error('❌ CalendarView: addAppointment function is missing!');
    }
  }, [addAppointment, appointments, patients, selectedDate]);

  // Obtener citas del día seleccionado
  const getDayAppointments = (date) => {
    if (!appointments) return [];
    return appointments.filter(apt => apt.date === date).sort((a, b) => a.time.localeCompare(b.time));
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'confirmada':
        return 'bg-green-100 text-green-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Calendar className="text-sky-500" size={32} />
          Calendario de Citas
        </h2>
        <button
          onClick={() => setShowNewAppointment(true)}
          className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:from-sky-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <Plus size={20} />
          Nueva Cita
        </button>
      </div>

      {/* Debug info */}
      {!addAppointment && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg">
          🔍 DEBUG: addAppointment function is missing in CalendarView props
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Seleccionar Fecha
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border-2 border-sky-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition-all duration-300"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getDayAppointments(selectedDate).map(appointment => {
            const patient = patients?.find(p => p.id === appointment.patientId);
            return (
              <div key={appointment.id} className="bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-sky-500 text-white p-2 rounded-full">
                      <Clock size={16} />
                    </div>
                    <span className="font-bold text-sky-800 text-lg">{appointment.time}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyles(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
                <h4 className="font-bold text-gray-800 text-lg mb-2">{patient?.name || 'Paciente no encontrado'}</h4>
                <p className="text-sky-700 font-medium mb-2">{appointment.type}</p>
                {appointment.notes && (
                  <p className="text-gray-600 text-sm italic">{appointment.notes}</p>
                )}
              </div>
            );
          })}
        </div>

        {getDayAppointments(selectedDate).length === 0 && (
          <div className="text-center py-12">
            <Calendar size={64} className="mx-auto mb-4 text-sky-300" />
            <p className="text-gray-500 text-lg">No hay citas programadas para esta fecha</p>
          </div>
        )}
      </div>

      <NewAppointmentModal 
        showModal={showNewAppointment}
        setShowModal={setShowNewAppointment}
        patients={patients}
        selectedDate={selectedDate}
        addAppointment={addAppointment}  // ⚠️ Pasar la función
      />
    </div>
  );
};

export default CalendarView;
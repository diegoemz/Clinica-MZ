import React, { useState } from 'react';
import { Clock, Sparkles } from 'lucide-react';
import { availableSlots } from '../data/initialData';

const AvailabilityView = ({ appointments, patients }) => {
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

  // Obtener citas del día seleccionado
  const getDayAppointments = (date) => {
    return appointments.filter(apt => apt.date === date).sort((a, b) => a.time.localeCompare(b.time));
  };

  // Obtener estadísticas
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

  const stats = getStats();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Clock className="text-sky-500" size={32} />
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
                <th className="border-2 border-gray-200 p-4 bg-gradient-to-br from-sky-50 to-cyan-50 font-bold text-gray-800 rounded-tl-xl">Hora</th>
                {weekDates.map((date, index) => (
                  <th key={index} className={`border-2 border-gray-200 p-4 bg-gradient-to-br from-sky-50 to-cyan-50 font-bold text-gray-800 min-w-40 ${index === 6 ? 'rounded-tr-xl' : ''}`}>
                    <div className="text-lg">{dayNames[date.getDay()]}</div>
                    <div className="text-sm font-normal text-gray-600">{date.getDate()}/{date.getMonth() + 1}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {availableSlots.map((time, timeIndex) => (
                <tr key={time}>
                  <td className={`border-2 border-gray-200 p-4 font-bold bg-gradient-to-br from-sky-50 to-cyan-50 text-gray-800 ${timeIndex === availableSlots.length - 1 ? 'rounded-bl-xl' : ''}`}>
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
                            ? 'bg-gradient-to-br from-sky-100 to-cyan-100 border-2 border-sky-200 hover:shadow-md'
                            : 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:bg-gradient-to-br hover:from-green-100 hover:to-emerald-100'
                        }`}>
                          {isBooked ? (
                            <div>
                              <div className="font-semibold text-sky-800 text-sm">Ocupado</div>
                              {patient && (
                                <div className="text-xs text-sky-600 mt-1 truncate">
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
            <div className="w-6 h-6 bg-gradient-to-br from-sky-100 to-cyan-100 border-2 border-sky-200 rounded"></div>
            <span className="text-gray-700 font-medium">Ocupado</span>
          </div>
        </div>
      </div>

      {/* Resumen del día */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
          <Sparkles className="text-sky-500" size={28} />
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

export default AvailabilityView;
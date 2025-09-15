import React from 'react';
import { Calendar, Clock, Users, Bell, Heart, Flower2, Sparkles, Plus } from 'lucide-react';
import StatsCard from './StatsCard';
import AppointmentCard from './AppointmentCard';

const Dashboard = ({ 
  appointments, 
  patients, 
  doctorName, 
  getAppointmentsByDate,
  getStats,
  addAppointment 
}) => {
  const stats = getStats();
  const todayAppointments = getAppointmentsByDate(new Date().toISOString().split('T')[0]);

  const statsConfig = [
    {
      label: 'Citas de Hoy',
      value: stats.todayAppointments,
      icon: Calendar,
      bgColor: 'bg-sky-100',
      textColor: 'text-sky-600',
      borderColor: 'border-sky-100'
    },
    {
      label: 'Total Pacientes',
      value: stats.totalPatients,
      icon: Users,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-100'
    },
    {
      label: 'Esta Semana',
      value: stats.weekAppointments,
      icon: Clock,
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-100'
    },
    {
      label: 'Pendientes',
      value: stats.pendingAppointments,
      icon: Bell,
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-100'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-sky-500 via-cyan-500 to-sky-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4">
          <Flower2 size={120} className="opacity-20" />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">¡Buen día, {doctorName}!</h2>
          <p className="text-sky-100 text-lg">Tienes {stats.todayAppointments} citas programadas para hoy</p>
          <div className="flex items-center gap-2 mt-4">
            <Heart size={20} className="text-sky-200" />
            <span className="text-sky-100">Cuidando la salud femenina con amor y profesionalismo</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Sparkles className="text-sky-500" size={28} />
            Citas de Hoy
          </h3>
        </div>

        {todayAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {todayAppointments.map(appointment => (
              <AppointmentCard 
                key={appointment.id} 
                appointment={appointment} 
                patients={patients}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Flower2 size={64} className="mx-auto mb-4 text-sky-300" />
            <p className="text-gray-500 text-lg">No hay citas programadas para hoy</p>
            <p className="text-gray-400">¡Perfecto día para descansar o ponerse al día!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
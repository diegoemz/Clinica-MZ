import React from 'react';
import { Clock } from 'lucide-react';

const AppointmentCard = ({ appointment, patients }) => {
  const patient = patients.find(p => p.id === appointment.patientId);

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'alta':
        return 'bg-red-100 text-red-800';
      case 'media':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-sky-500 text-white p-2 rounded-full">
            <Clock size={16} />
          </div>
          <span className="font-bold text-sky-800 text-lg">{appointment.time}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityStyles(appointment.priority)}`}>
          {appointment.priority}
        </span>
      </div>
      <h4 className="font-bold text-gray-800 text-lg mb-2">{patient?.name}</h4>
      <p className="text-sky-700 font-medium mb-2">{appointment.type}</p>
      {appointment.notes && (
        <p className="text-gray-600 text-sm italic">{appointment.notes}</p>
      )}
    </div>
  );
};

export default AppointmentCard;
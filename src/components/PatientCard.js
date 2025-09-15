import React from 'react';
import { User, Mail, Phone, MapPin, FileText } from 'lucide-react';

const PatientCard = ({ patient, onClick }) => {
  return (
    <div 
      className={`${patient.profileColor} border-2 border-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-white bg-opacity-80 p-2 rounded-full">
            <User size={20} className="text-gray-700" />
          </div>
          <h3 className="font-bold text-gray-800 text-lg">{patient.name}</h3>
        </div>
        <button className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-white hover:bg-opacity-50 transition-all duration-300">
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
  );
};

export default PatientCard;
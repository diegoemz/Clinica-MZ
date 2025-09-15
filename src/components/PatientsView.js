import React, { useState } from 'react';
import { Users, Search, Plus } from 'lucide-react';
import PatientCard from './PatientCard';
import PatientProfileModal from './PatientProfileModal';
import NewPatientForm from './NewPatientForm';

const PatientsView = ({ patients, setPatients }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPatientProfile, setShowPatientProfile] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Filtrar pacientes por búsqueda
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setShowPatientProfile(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Users className="text-sky-500" size={32} />
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
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition-all duration-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map(patient => (
            <PatientCard 
              key={patient.id} 
              patient={patient} 
              onClick={() => handlePatientClick(patient)}
            />
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <Users size={64} className="mx-auto mb-4 text-sky-300" />
            <p className="text-gray-500 text-lg">No se encontraron pacientes</p>
          </div>
        )}
      </div>

      <NewPatientForm 
        patients={patients}
        setPatients={setPatients}
      />

      <PatientProfileModal 
        showModal={showPatientProfile}
        setShowModal={setShowPatientProfile}
        patient={selectedPatient}
      />
    </div>
  );
};

export default PatientsView;
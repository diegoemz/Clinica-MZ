import React from 'react';
import { X, User, Heart, Activity, FileText } from 'lucide-react';

const PatientProfileModal = ({ showModal, setShowModal, patient }) => {
  if (!showModal || !patient) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className={`${patient.profileColor} p-4 rounded-2xl`}>
              <User size={32} className="text-gray-700" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800">{patient.name}</h3>
              <p className="text-gray-600">{patient.occupation}</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información Personal */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-sky-50 to-cyan-50 rounded-2xl p-6 border border-sky-100">
              <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Heart className="text-sky-500" size={24} />
                Información Personal
              </h4>
              <div className="space-y-4">
                {[
                  { label: 'Nombre Completo', value: patient.name },
                  { label: 'Fecha de Nacimiento', value: patient.birthDate },
                  { label: 'Estado Civil', value: patient.civilStatus },
                  { label: 'Ocupación', value: patient.occupation },
                  { label: 'Email', value: patient.email },
                  { label: 'Teléfono', value: patient.phone },
                  { label: 'Dirección', value: patient.address }
                ].map((field, index) => (
                  <div key={index}>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{field.label}</label>
                    <p className="text-gray-900 bg-white p-3 rounded-lg">{field.value}</p>
                  </div>
                ))}
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
                    <p className="text-gray-900 bg-white p-3 rounded-lg font-semibold">{patient.bloodType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Seguro Médico</label>
                    <p className="text-gray-900 bg-white p-3 rounded-lg">{patient.insurance}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Alergias</label>
                    <p className="text-gray-900 bg-white p-3 rounded-lg">{patient.allergies}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Contacto de Emergencia</label>
                    <p className="text-gray-900 bg-white p-3 rounded-lg">{patient.emergencyContact}</p>
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
                  {patient.medicalHistory.length > 0 ? (
                    patient.medicalHistory.map((entry, index) => (
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
  );
};

export default PatientProfileModal;
import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const NewPatientForm = ({ addPatient }) => {
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreatePatient = async () => {
    if (!newPatient.name || !newPatient.email || !newPatient.phone) {
      setError('Por favor completa los campos requeridos (nombre, email y teléfono)');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await addPatient(newPatient);
      
      // Limpiar formulario
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
      
      setSuccess('Paciente registrada exitosamente');
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al registrar paciente: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
        <Plus className="text-sky-500" size={28} />
        Registrar Nueva Paciente
      </h3>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg">
          {success}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre Completo *</label>
          <input
            type="text"
            value={newPatient.name}
            onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
            disabled={loading}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition-all duration-300 disabled:opacity-50"
            placeholder="Nombre completo"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            value={newPatient.email}
            onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
            disabled={loading}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition-all duration-300 disabled:opacity-50"
            placeholder="email@ejemplo.com"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono *</label>
          <input
            type="tel"
            value={newPatient.phone}
            onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
            disabled={loading}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition-all duration-300 disabled:opacity-50"
            placeholder="+503 7234-5678"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha de Nacimiento</label>
          <input
            type="date"
            value={newPatient.birthDate}
            onChange={(e) => setNewPatient({...newPatient, birthDate: e.target.value})}
            disabled={loading}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition-all duration-300 disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Estado Civil</label>
          <select
            value={newPatient.civilStatus}
            onChange={(e) => setNewPatient({...newPatient, civilStatus: e.target.value})}
            disabled={loading}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition-all duration-300 disabled:opacity-50"
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
            disabled={loading}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition-all duration-300 disabled:opacity-50"
            placeholder="Ocupación"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Sangre</label>
          <select
            value={newPatient.bloodType}
            onChange={(e) => setNewPatient({...newPatient, bloodType: e.target.value})}
            disabled={loading}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition-all duration-300 disabled:opacity-50"
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
            disabled={loading}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition-all duration-300 disabled:opacity-50"
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
            disabled={loading}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition-all duration-300 disabled:opacity-50"
            placeholder="Alergias conocidas"
          />
        </div>
        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Dirección</label>
          <input
            type="text"
            value={newPatient.address}
            onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
            disabled={loading}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition-all duration-300 disabled:opacity-50"
            placeholder="Dirección completa"
          />
        </div>
        <div className="lg:col-span-3">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Contacto de Emergencia</label>
          <input
            type="text"
            value={newPatient.emergencyContact}
            onChange={(e) => setNewPatient({...newPatient, emergencyContact: e.target.value})}
            disabled={loading}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition-all duration-300 disabled:opacity-50"
            placeholder="Nombre y teléfono del contacto de emergencia"
          />
        </div>
      </div>
      <div className="mt-8">
        <button
          onClick={handleCreatePatient}
          disabled={loading}
          className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-8 py-4 rounded-xl hover:from-sky-600 hover:to-cyan-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <Plus size={20} />
          {loading ? 'Registrando...' : 'Registrar Paciente'}
        </button>
      </div>
    </div>
  );
};

export default NewPatientForm;
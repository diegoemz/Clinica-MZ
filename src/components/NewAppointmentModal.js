import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { availableSlots, appointmentTypes } from '../data/initialData';

const NewAppointmentModal = ({ 
  showModal, 
  setShowModal, 
  patients, 
  selectedDate,
  addAppointment  // ⚠️ Esta función debe venir de props
}) => {
  const [newAppointment, setNewAppointment] = useState({
    patientId: '',
    date: selectedDate,
    time: '',
    type: '',
    notes: '',
    priority: 'normal'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🔍 DEBUG: Verificar que la función existe
  useEffect(() => {
    console.log('🔍 NewAppointmentModal props:', {
      addAppointment: typeof addAppointment,
      patients: patients?.length,
      showModal
    });
    
    if (!addAppointment) {
      console.error('❌ addAppointment function is missing from props!');
    }
  }, [addAppointment, patients, showModal]);

  const handleCreateAppointment = async () => {
    // 🔍 Verificar función antes de usarla
    if (!addAppointment) {
      setError('Error: La función addAppointment no está disponible');
      console.error('❌ addAppointment is not a function');
      return;
    }

    if (!newAppointment.patientId || !newAppointment.time || !newAppointment.type) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('📝 Creando cita con datos:', newAppointment);
      const result = await addAppointment(newAppointment);
      console.log('✅ Cita creada exitosamente:', result);
      
      // Limpiar formulario
      setNewAppointment({
        patientId: '',
        date: selectedDate,
        time: '',
        type: '',
        notes: '',
        priority: 'normal'
      });
      
      setShowModal(false);
    } catch (err) {
      console.error('❌ Error creating appointment:', err);
      setError('Error al crear la cita: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Sparkles className="text-sky-500" size={28} />
            Nueva Cita
          </h3>
          <button
            onClick={() => setShowModal(false)}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-all duration-300 disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Debug info */}
        {!addAppointment && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            🔍 DEBUG: addAppointment function is missing from props
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Paciente *</label>
            <select
              value={newAppointment.patientId}
              onChange={(e) => setNewAppointment({...newAppointment, patientId: e.target.value})}
              disabled={loading}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition-all duration-300 disabled:opacity-50"
            >
              <option value="">Seleccionar paciente</option>
              {patients?.map(patient => (
                <option key={patient.id} value={patient.id}>{patient.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha *</label>
              <input
                type="date"
                value={newAppointment.date}
                onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                disabled={loading}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition-all duration-300 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hora *</label>
              <select
                value={newAppointment.time}
                onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                disabled={loading}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition-all duration-300 disabled:opacity-50"
              >
                <option value="">Seleccionar hora</option>
                {availableSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Consulta *</label>
            <select
              value={newAppointment.type}
              onChange={(e) => setNewAppointment({...newAppointment, type: e.target.value})}
              disabled={loading}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition-all duration-300 disabled:opacity-50"
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
              disabled={loading}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition-all duration-300 disabled:opacity-50"
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
              disabled={loading}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition-all duration-300 disabled:opacity-50"
              rows="3"
              placeholder="Notas adicionales..."
            />
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={handleCreateAppointment}
            disabled={loading || !addAppointment}
            className="flex-1 bg-gradient-to-r from-sky-500 to-cyan-500 text-white py-3 rounded-xl hover:from-sky-600 hover:to-cyan-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Creando...' : 'Crear Cita'}
          </button>
          <button
            onClick={() => setShowModal(false)}
            disabled={loading}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewAppointmentModal;
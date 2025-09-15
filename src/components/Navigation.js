import React from 'react';
import { Calendar, Clock, Users, Sparkles } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Sparkles },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'patients', label: 'Mis Pacientes', icon: Users },
    { id: 'availability', label: 'Mi Agenda', icon: Clock }
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-sky-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex space-x-12">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`py-6 px-4 border-b-4 font-semibold text-lg transition-all duration-300 ${
                activeTab === id
                  ? 'border-sky-500 text-sky-600 bg-sky-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={24} />
                {label}
              </div>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
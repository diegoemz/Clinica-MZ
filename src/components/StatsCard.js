import React from 'react';

const StatsCard = ({ label, value, icon: Icon, bgColor, textColor, borderColor }) => {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-lg border ${borderColor} hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-full`}>
          <Icon size={24} className={textColor} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
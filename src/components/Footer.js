import React from 'react';
import { Heart, Phone, Mail } from 'lucide-react';

const Footer = ({ doctorName }) => {
  return (
    <footer className="bg-gradient-to-r from-sky-600 via-cyan-600 to-sky-700 text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart size={24} className="text-sky-200" />
            <span className="text-lg font-semibold">{doctorName}</span>
            <Heart size={24} className="text-sky-200" />
          </div>
          <p className="text-sky-200">Cuidando la salud femenina con amor, dedicación y profesionalismo</p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sky-200">
            <div className="flex items-center gap-1">
              <Phone size={16} />
              <span>+503 2XXX-XXXX</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail size={16} />
              <span>consultorio@email.com</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
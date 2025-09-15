// firebase/config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Tu configuración de Firebase (obtenla desde Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyB3_iqEiOZFK-AQ4cpwygh6oHvqfKlpsNE",
  authDomain: "clinica-mz.firebaseapp.com",
  projectId: "clinica-mz",
  storageBucket: "clinica-mz.firebasestorage.app",
  messagingSenderId: "795910730903",
  appId: "1:795910730903:web:bfb3e07dfb2f295b52a5d2",
  measurementId: "G-74DK1DZL6E"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);

// Inicializar Auth
export const auth = getAuth(app);

// Configurar persistencia de autenticación
// auth.useDeviceLanguage(); // Opcional: usar idioma del dispositivo

export default app;
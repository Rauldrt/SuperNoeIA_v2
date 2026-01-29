
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// --- CONFIGURACIÓN DE FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyC5hJ6KyeJ0_vF38iKq2frHV59yVKYstRU",
  authDomain: "super-noe-ai.firebaseapp.com",
  projectId: "super-noe-ai",
  storageBucket: "super-noe-ai.firebasestorage.app",
  messagingSenderId: "519420224659",
  appId: "1:519420224659:web:1e9210044c6ca06f7d9966",
  measurementId: "G-CHMVWG2TBS"
};

// Inicialización de la App
const app = initializeApp(firebaseConfig);

// Inicialización de la Base de Datos
const db = getFirestore(app);

console.log("🔥 Firebase Connected (Shared Knowledge Base Mode)");

export { db };
export default app;

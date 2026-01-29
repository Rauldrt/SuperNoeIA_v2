
/// <reference types="node" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno de forma segura
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    // 'base' define la ruta raíz para el despliegue. './' es vital para GitHub Pages.
    base: './', 
    build: {
      outDir: 'dist',
    },
    define: {
      // Reemplazamos process.env.API_KEY con el valor real (o vacío) en tiempo de construcción
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY || '')
    }
  };
});

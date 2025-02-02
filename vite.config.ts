import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Permite acesso externo
    port: 5173,       // Garante que a porta correta seja usada
    strictPort: true, // Garante que a porta 5173 será usada, senão erro
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

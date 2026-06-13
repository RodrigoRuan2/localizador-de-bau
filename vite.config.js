import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuração mínima do Vite: só precisamos ativar o plugin do React,
// que é quem entende a sintaxe JSX dos nossos componentes.
export default defineConfig({
  plugins: [react()],
})

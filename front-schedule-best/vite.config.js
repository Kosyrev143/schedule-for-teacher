import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Чтобы Vite слушал на всех интерфейсах сети
    watch: {
      usePolling: true, // Включает polling (может потребовать установки дополнительных пакетов)
      interval: 100, // Интервал проверки изменений (в миллисекундах)
    },
  },
})

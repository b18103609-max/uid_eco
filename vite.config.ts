import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages подаёт сайт по пути /uid_eco/. Если репозиторий переименуете,
  // поменяйте здесь и URL автоматически перестроится.
  base: '/uid_eco/',
});

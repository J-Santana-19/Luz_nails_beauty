import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  base: mode === 'github-pages' ? '/Luz_nails_beauty/' : '/',
  plugins: [react()],
  envPrefix: ['VITE_', 'PUBLIC_'],
  test: {
    environment: 'jsdom',
    globals: true,
  },
}));

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.svg', 'favicon.png', 'favicon-180.png'],
      devOptions: {
        enabled: true,
        type: 'module',
      },
      manifest: {
        id: '/',
        name: 'CatatKu — Notebook Kuliah Mahasiswa',
        short_name: 'CatatKu',
        description: 'Aplikasi notebook kuliah: mencatat, melacak tenggat, dan alarm pengingat.',
        lang: 'id',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#FAFAF7',
        theme_color: '#3E5C4F',
        categories: ['education', 'productivity'],
        icons: [
          { src: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/favicon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        // Tambahkan handler push/notificationclick ke service worker hasil generate Workbox.
        importScripts: ['/push-handler.js']
      }
    })
  ],
  server: {
    port: 3000,
    open: false
  }
});

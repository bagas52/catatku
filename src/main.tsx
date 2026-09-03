import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Daftarkan service worker PWA hanya di production (JANGAN ganggu dev/hot-reload)
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('Gagal mendaftarkan service worker:', err);
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

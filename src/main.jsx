import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registrado!', reg))
      .catch(err => console.log('Erro no SW:', err));
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)

import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import { EditorApp } from './components/editor-app/component';
import { BrowserRouter } from 'react-router-dom';

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered: ', registration);
    } catch (registrationError) {
      console.log('SW registration failed: ', registrationError);
    }
  });
}

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <EditorApp />
    </BrowserRouter>
  </React.StrictMode>
);

import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import { EditorApp } from './components/editor-app/component';
import { BrowserRouter } from 'react-router-dom';
import { PostHogProvider } from '@posthog/react';
import {
  initAnalytics,
  posthog,
  setAnalyticsEnv,
  captureException
} from './analytics';

setAnalyticsEnv({
  apiKey: import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN,
  apiHost: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  enabled: import.meta.env.VITE_PUBLIC_POSTHOG_ENABLED !== 'false'
});
initAnalytics();

window.addEventListener('error', (event) => {
  captureException(event.error ?? event.message);
});
window.addEventListener('unhandledrejection', (event) => {
  captureException(event.reason);
});

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
    <PostHogProvider client={posthog}>
      <BrowserRouter>
        <EditorApp />
      </BrowserRouter>
    </PostHogProvider>
  </React.StrictMode>
);

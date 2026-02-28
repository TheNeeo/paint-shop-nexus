import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Global error suppressor for transient "Failed to fetch" network errors
// that frequently occur in cloud IDE proxy environments (Vite HMR pings, etc.)
(function() {
  // Suppress "Failed to fetch" and "Load failed" console errors from Vite internal pings
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    try {
      return await originalFetch(...args);
    } catch (error: any) {
      let url = '';
      if (typeof args[0] === 'string') {
        url = args[0];
      } else if (args[0] instanceof Request) {
        url = args[0].url;
      } else if (args[0] instanceof URL) {
        url = args[0].toString();
      }

      const isVitePing = url.includes('__vite_ping');
      const isViteClient = url.includes('@vite/client') || url.includes('vite/dist/client');
      const isHmrLoad = url.includes('?t=') || url.includes('?v=') || url.includes('&v=');
      const isTransientNetworkError = error.message?.includes('Failed to fetch') || error.message?.includes('Load failed');

      if (isVitePing || (isTransientNetworkError && (isViteClient || isHmrLoad))) {
        // Silently handle Vite-related network pings and client module loads
        return new Response(null, { status: 204 });
      }

      // If it's a network error on a data fetch, we log it but still throw
      // so it can be caught by fetchWithRetry or other error handlers
      if (isTransientNetworkError) {
        console.warn(`Transient fetch error for ${url}:`, error.message);
      }

      throw error;
    }
  };

  // Prevent error reporting for transient network errors that are out of our control
  window.addEventListener('error', (event) => {
    const isVitePingError =
      (event.message.includes('Failed to fetch') || event.message.includes('Load failed')) &&
      (event.filename && event.filename.includes('@vite/client'));

    if (isVitePingError) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
})();

createRoot(document.getElementById("root")!).render(<App />);

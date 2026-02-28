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
      const url = typeof args[0] === 'string' ? args[0] : (args[0] instanceof Request ? args[0].url : '');
      if (url.includes('/__vite_ping') || error.message?.includes('Failed to fetch')) {
        if (url.includes('/__vite_ping')) {
          // Returning a dummy response for Vite pings stops the error from being reported globally
          return new Response(null, { status: 204 });
        }
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

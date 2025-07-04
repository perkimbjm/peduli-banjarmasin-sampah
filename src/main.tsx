import './polyfills/global';
if (typeof global === "undefined") {
  window.global = window;
}

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import React, { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import './index.css'
import 'leaflet/dist/leaflet.css';
import ThemeInitializer from './ThemeInitializer';


createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeInitializer>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeInitializer>
  </React.StrictMode>
);

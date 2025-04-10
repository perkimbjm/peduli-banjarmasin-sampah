import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import './index.css'
import 'leaflet/dist/leaflet.css';

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

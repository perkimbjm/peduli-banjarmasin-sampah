import './polyfills/global';
if (typeof global === "undefined") {
  // @ts-ignore
  window.global = window;
}

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import React, { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import './index.css'
import 'leaflet/dist/leaflet.css';

// Theme initialization component
const ThemeInitializer = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Check for user preference
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set dark mode based on preference
    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, []);

  return <>{children}</>;
};

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeInitializer>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeInitializer>
  </React.StrictMode>
);

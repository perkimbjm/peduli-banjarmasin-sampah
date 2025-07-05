
import { useEffect, ReactNode } from 'react';

interface ThemeInitializerProps {
  children: ReactNode;
}

// Theme initialization component
const ThemeInitializer = ({ children }: ThemeInitializerProps) => {
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

export default ThemeInitializer;

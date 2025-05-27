
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('light'); // Default to light, will be updated by useEffect
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      const storedTheme = localStorage.getItem('theme') as Theme | null;
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (storedTheme) {
        setThemeState(storedTheme);
      } else if (systemPrefersDark) {
        setThemeState('dark');
      } else {
        setThemeState('light');
      }
    }
  }, [hasMounted]);

  useEffect(() => {
    if (hasMounted) {
      const root = window.document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem('theme', theme);
    }
  }, [theme, hasMounted]);

  const toggleTheme = useCallback(() => {
    if (hasMounted) {
      setThemeState((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    }
  }, [hasMounted]);

  const setTheme = useCallback((newTheme: Theme) => {
    if (hasMounted) {
      setThemeState(newTheme);
    }
  }, [hasMounted]);

  // Provide a stable theme value during server render / pre-hydration
  const currentTheme = hasMounted ? theme : 'light';


  return (
    <ThemeContext.Provider value={{ theme: currentTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

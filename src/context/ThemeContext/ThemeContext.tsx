// src/contexts/ThemeContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark';
export type ThemeColor = 'default' | 'blue' | 'green' | 'purple' | 'orange';

interface ThemeContextType {
  themeMode: ThemeMode;
  themeColor: ThemeColor;
  setThemeMode: (mode: ThemeMode) => void;
  setThemeColor: (color: ThemeColor) => void;
  toggleThemeMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Validation des valeurs stockées localement
const validateThemeMode = (value: string | null): ThemeMode => {
  return (value === 'light' || value === 'dark') ? value as ThemeMode : 'light';
};

const validateThemeColor = (value: string | null): ThemeColor => {
  return (value === 'default' || value === 'blue' || 
          value === 'green' || value === 'purple' ||
          value === 'orange') ? value as ThemeColor : 'default';
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Utiliser les préférences stockées avec validation
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return validateThemeMode(savedMode);
  });

  const [themeColor, setThemeColorState] = useState<ThemeColor>(() => {
    const savedColor = localStorage.getItem('themeColor');
    return validateThemeColor(savedColor);
  });

  // Optimisation avec useCallback pour réduire les rendus inutiles
  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('themeMode', mode);
  }, []);

  const setThemeColor = useCallback((color: ThemeColor) => {
    setThemeColorState(color);
    localStorage.setItem('themeColor', color);
  }, []);

  const toggleThemeMode = useCallback(() => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeModeState(newMode);
    localStorage.setItem('themeMode', newMode);
  }, [themeMode]);

  // Appliquer le thème au document
  useEffect(() => {
    // Enlever toutes les classes de thème existantes
    document.body.classList.remove('theme-light', 'theme-dark');
    
    // Ajouter la nouvelle classe de thème
    document.body.classList.add(`theme-${themeMode}`);
    
    // Enlever toutes les classes de couleur existantes
    document.body.classList.remove(
      'theme-color-default', 
      'theme-color-blue', 
      'theme-color-green', 
      'theme-color-purple', 
      'theme-color-orange'
    );
    
    // Ajouter la nouvelle classe de couleur
    document.body.classList.add(`theme-color-${themeColor}`);
    
    // Logs uniquement en développement
    if (process.env.NODE_ENV === 'development') {
      console.log(`Theme updated: ${themeMode}, color: ${themeColor}`);
    }
  }, [themeMode, themeColor]);

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        themeColor,
        setThemeMode,
        setThemeColor,
        toggleThemeMode
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

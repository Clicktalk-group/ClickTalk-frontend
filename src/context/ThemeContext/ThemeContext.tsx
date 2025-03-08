// src/contexts/ThemeContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

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

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Utiliser les préférences stockées ou les valeurs par défaut
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode === 'light' || savedMode === 'dark') ? savedMode : 'light';
  });

  const [themeColor, setThemeColor] = useState<ThemeColor>(() => {
    const savedColor = localStorage.getItem('themeColor');
    return (savedColor === 'default' || savedColor === 'blue' || 
            savedColor === 'green' || savedColor === 'purple' ||
            savedColor === 'orange') ? savedColor as ThemeColor : 'default';
  });

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
    
    // Sauvegarder les préférences
    localStorage.setItem('themeMode', themeMode);
    localStorage.setItem('themeColor', themeColor);
    
    console.log(`Theme updated: ${themeMode}, color: ${themeColor}`);
  }, [themeMode, themeColor]);

  // Toggle entre les thèmes clair et sombre
  const toggleThemeMode = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

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

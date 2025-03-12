// src/components/modals/ThemeModal/ThemeModal.tsx
import React, { useMemo, useCallback, memo } from 'react';
import { useTheme } from '../../../context/ThemeContext/ThemeContext';
import './ThemeModal.scss';

interface ThemeModalContentProps {
  onClose: () => void;
}

// Définition du type pour les couleurs de thème
type ThemeColorType = 'default' | 'blue' | 'green' | 'purple' | 'orange';

// Définition des classes CSS pour les couleurs
interface ColorInfo {
  className: string;
  label: string;
}

const ThemeModalContent: React.FC<ThemeModalContentProps> = memo(({ onClose }) => {
  const { themeMode, themeColor, setThemeMode, setThemeColor } = useTheme();

  // Définir les couleurs des boutons de thème (mémorisé)
  const colorInfo = useMemo<Record<ThemeColorType, ColorInfo>>(() => ({
    default: { className: 'color-default', label: 'Violet (défaut)' },
    blue: { className: 'color-blue', label: 'Bleu' },
    green: { className: 'color-green', label: 'Vert' },
    purple: { className: 'color-purple', label: 'Violet alternatif' },
    orange: { className: 'color-orange', label: 'Orange' }
  }), []);

  // Gestionnaires d'événements mémorisés
  const handleModeChange = useCallback((mode: 'light' | 'dark') => {
    setThemeMode(mode);
  }, [setThemeMode]);

  const handleColorChange = useCallback((color: ThemeColorType) => {
    setThemeColor(color as any);
  }, [setThemeColor]);
  
  // Générer les boutons de mode manuellement pour éviter les expressions dans aria-checked
  const renderModeButton = useCallback((mode: 'light' | 'dark', label: string) => {
    const isSelected = themeMode === mode;
    const className = `theme-button ${isSelected ? 'active' : ''}`;
    
    // On utilise des conditions pour rendre des éléments avec des valeurs statiques
    if (isSelected) {
      return (
        <button
          className={className}
          onClick={() => handleModeChange(mode)}
          role="radio"
          aria-checked="true"
          type="button"
        >
          {label}
        </button>
      );
    } else {
      return (
        <button
          className={className}
          onClick={() => handleModeChange(mode)}
          role="radio"
          aria-checked="false"
          type="button"
        >
          {label}
        </button>
      );
    }
  }, [themeMode, handleModeChange]);
  
  // Générer les boutons de couleur
  const renderColorButton = useCallback((color: ThemeColorType) => {
    const isSelected = themeColor === color;
    const baseClassName = `color-button ${colorInfo[color].className} ${isSelected ? 'active' : ''}`;
    
    if (isSelected) {
      return (
        <button
          key={color}
          type="button" 
          className={baseClassName}
          onClick={() => handleColorChange(color)}
          aria-label={colorInfo[color].label}
          role="radio"
          aria-checked="true"
        />
      );
    } else {
      return (
        <button
          key={color}
          type="button"
          className={baseClassName}
          onClick={() => handleColorChange(color)}
          aria-label={colorInfo[color].label}
          role="radio"
          aria-checked="false"
        />
      );
    }
  }, [themeColor, colorInfo, handleColorChange]);

  return (
    <div className="theme-modal-content">
      <div className="theme-section">
        <h3 id="theme-mode-heading">Mode d'affichage</h3>
        <div className="theme-options" role="radiogroup" aria-labelledby="theme-mode-heading">
          {renderModeButton('light', 'Clair')}
          {renderModeButton('dark', 'Sombre')}
        </div>
      </div>

      <div className="theme-section">
        <h3 id="theme-color-heading">Couleur d'accentuation</h3>
        <div 
          className="color-options" 
          role="radiogroup" 
          aria-labelledby="theme-color-heading"
        >
          {(Object.keys(colorInfo) as Array<ThemeColorType>).map(renderColorButton)}
        </div>
      </div>

      <div className="button-group">
        <button 
          className="cancel-button" 
          onClick={onClose} 
          type="button"
          aria-label="Fermer le panneau de thème"
        >
          Fermer
        </button>
      </div>
    </div>
  );
});

ThemeModalContent.displayName = 'ThemeModalContent';

export default ThemeModalContent;
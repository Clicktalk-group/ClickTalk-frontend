// src/components/modals/ThemeModal/ThemeModal.tsx
import React from 'react';
import { useTheme } from '../../../context/ThemeContext/ThemeContext';
import './ThemeModal.scss';

interface ThemeModalContentProps {
  onClose: () => void;
}

const ThemeModalContent: React.FC<ThemeModalContentProps> = ({ onClose }) => {
  const { themeMode, themeColor, setThemeMode, setThemeColor } = useTheme();

  // Définir les couleurs des boutons de thème
  const colorStyles = {
    default: { backgroundColor: '#7c3aed' }, // Violet (défaut)
    blue: { backgroundColor: '#3b82f6' },    // Bleu
    green: { backgroundColor: '#10b981' },   // Vert
    purple: { backgroundColor: '#8b5cf6' },  // Violet alternatif
    orange: { backgroundColor: '#f59e0b' }   // Orange
  };

  return (
    <div className="theme-modal-content">
      <div className="theme-section">
        <h3>Mode d'affichage</h3>
        <div className="theme-options">
          <button
            className={`theme-button ${themeMode === 'light' ? 'active' : ''}`}
            onClick={() => setThemeMode('light')}
          >
            Clair
          </button>
          <button
            className={`theme-button ${themeMode === 'dark' ? 'active' : ''}`}
            onClick={() => setThemeMode('dark')}
          >
            Sombre
          </button>
        </div>
      </div>

      <div className="theme-section">
        <h3>Couleur d'accentuation</h3>
        <div className="color-options">
          {(Object.keys(colorStyles) as Array<keyof typeof colorStyles>).map((color) => (
            <button
              key={color}
              className={`color-button ${themeColor === color ? 'active' : ''}`}
              style={colorStyles[color]}
              onClick={() => setThemeColor(color)}
              aria-label={`Couleur ${color}`}
            />
          ))}
        </div>
      </div>

      <div className="button-group">
        <button className="cancel-button" onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>
  );
};

export default ThemeModalContent;

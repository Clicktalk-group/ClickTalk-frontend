// src/pages/Settings/Settings.tsx
import React, { useState } from 'react';
import { FaUser, FaMoon, FaSun, FaSignOutAlt, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext/AuthContext';
import './Settings.scss';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Récupérer la préférence depuis localStorage ou utiliser la préférence du système
    return localStorage.getItem('darkMode') === 'true' || 
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Fonction pour basculer le thème
  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem('darkMode', String(newValue));
    
    // Appliquer le thème au document
    if (newValue) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  // Gestionnaire pour la suppression de compte (à implémenter)
  const handleDeleteAccount = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      try {
        // Implémenter l'appel API pour supprimer le compte
        console.log('Suppression du compte...');
        // Après suppression, déconnecter l'utilisateur
        await logout();
      } catch (error) {
        console.error('Erreur lors de la suppression du compte:', error);
      }
    }
  };

  return (
    <div className="settings-page">
      <h1>Paramètres</h1>
      
      <section className="settings-section user-section">
        <h2>Profil</h2>
        <div className="user-info">
          <div className="avatar">
            <FaUser />
          </div>
          <div className="user-details">
            <h3>{user?.username || 'Utilisateur'}</h3>
            <p>{user?.email}</p>
          </div>
        </div>
      </section>
      
      <section className="settings-section">
        <h2>Apparence</h2>
        <div className="setting-item">
          <div className="setting-label">
            <span>Thème sombre</span>
            <p className="setting-description">Changer l'apparence de l'application</p>
          </div>
          <div className="setting-control">
            <div 
              className={`theme-toggle ${darkMode ? 'theme-dark' : 'theme-light'}`}
              onClick={toggleDarkMode}
            >
              {darkMode ? <FaMoon /> : <FaSun />}
              <span>{darkMode ? 'Activé' : 'Désactivé'}</span>
            </div>
          </div>
        </div>
      </section>
      
      <section className="settings-section danger-zone">
        <h2>Compte</h2>
        <div className="danger-actions">
          <button className="logout-button" onClick={logout}>
            <FaSignOutAlt />
            <span>Déconnexion</span>
          </button>
          
          <button className="delete-account-button" onClick={handleDeleteAccount}>
            <FaTrash />
            <span>Supprimer mon compte</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Settings;

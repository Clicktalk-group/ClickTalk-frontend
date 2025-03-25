// src/pages/Settings/Settings.tsx
import React, { useState } from 'react';
import { FaUser, FaMoon, FaSun, FaSignOutAlt, FaTrash, FaQuestionCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext/AuthContext';
import { Modal } from '../../components/common/Modal/Modal';
import './Settings.scss';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('darkMode') === 'true' || 
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [selectedColor, setSelectedColor] = useState<string>(
    localStorage.getItem('themeColor') || '#3498db'
  );

  // Couleurs disponibles dans la palette
  const colorOptions = [
    '#3498db', // Bleu primaire
    '#2ecc71', // Vert
    '#e74c3c', // Rouge
    '#f39c12', // Orange
    '#9b59b6', // Violet
    '#1abc9c', // Turquoise
    '#34495e', // Bleu foncé
    '#e67e22', // Orange foncé
    '#16a085', // Vert foncé
    '#8e44ad' // Violet foncé
  ];

  // Gestion du changement dans les champs du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

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

  // Fonction pour changer la couleur du thème
  const changeThemeColor = (color: string) => {
    setSelectedColor(color);
    localStorage.setItem('themeColor', color);
    
    // Application de la couleur principale
    document.documentElement.style.setProperty('--primary-color', color);
  };

  // Gestionnaire de soumission du formulaire
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // À implémenter: Appel API pour mettre à jour les informations utilisateur
    // Dans une implémentation complète, nous appellerions un service API ici
    // et afficherions une notification de succès après la réponse positive
    alert('Modifications enregistrées avec succès');
  };

  // Gestionnaire pour la suppression de compte
  const handleDeleteAccount = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      try {
        // Implémenter l'appel API pour supprimer le compte
        // Dans une implémentation réelle, nous appellerions un service API ici
        await logout();
      } catch (error) {
        // Afficher un message d'erreur à l'utilisateur
        alert('Erreur lors de la suppression du compte. Veuillez réessayer plus tard.');
      }
    }
  };

  return (
    <div className="settings-page">
      <h1>Paramètres</h1>
      
      <section className="settings-section user-section">
        <h2>Compte</h2>
        <div className="user-info">
          <div className="avatar">
            <FaUser />
          </div>
          <div className="user-details">
            <h3>{user?.username || 'Utilisateur'}</h3>
            <p>{user?.email}</p>
          </div>
        </div>
        
        <form className="account-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Nom</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Votre nom d'utilisateur"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Votre email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="currentPassword">Mot de passe actuel</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              placeholder="Votre mot de passe actuel"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="newPassword">Nouveau mot de passe</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="Nouveau mot de passe"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirmer le nouveau mot de passe"
            />
          </div>
          
          <button type="submit" className="save-button">
            Enregistrer les modifications
          </button>
        </form>
      </section>
      
      <section className="settings-section">
        <h2>Thème</h2>
        <div className="setting-item">
          <div className="setting-label">
            <span>Mode sombre</span>
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
        
        <div className="setting-item">
          <div className="setting-label">
            <span>Couleur du thème</span>
            <p className="setting-description">Personnaliser la couleur principale</p>
          </div>
          <div className="setting-control">
            <div className="color-palette">
              {colorOptions.map((color) => (
                <div
                  key={color}
                  className={`color-option ${color === selectedColor ? 'active' : ''}`}
                  data-color={color}
                  onClick={() => changeThemeColor(color)}
                  aria-label={`Couleur thème ${color}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <section className="settings-section">
        <h2>Aide</h2>
        <div className="help-section">
          <p>Besoin d'assistance pour utiliser ClickTalk?</p>
          <button
            className="help-button"
            onClick={() => setIsHelpModalOpen(true)}
          >
            <FaQuestionCircle />
            <span>Obtenir de l'aide</span>
          </button>
        </div>
      </section>
      
      <section className="settings-section danger-zone">
        <h2>Actions de compte</h2>
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
      
      {/* Modal d'aide */}
      <Modal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        title="Aide ClickTalk"
        size="md">
        <div className="help-modal-content">
          <h3>Bienvenue dans l'aide de ClickTalk</h3>
          <p>
          ClickTalk est un chatbot intelligent utilisant le Machine Learning pour interagir avec vous et répondre à vos questions. Voici quelques informations pour vous aider à tirer le meilleur parti de ClickTalk.
          </p>
          
          <h4>Fonctionnalités principales</h4>
          <ul>
            <li><strong>Conversations</strong> - Discutez avec notre IA et obtenez des réponses instantanées</li>
            <li><strong>Projects</strong> - Organisez vos conversations par projets avec des instructions spécifiques</li>
            <li><strong>Personnalisation</strong> - Adaptez l'apparence de l'application selon vos préférences</li>
          </ul>
 
          <h4>Astuces d'utilisation</h4>
          <ul>
            <li>Soyez précis dans vos questions pour obtenir les meilleures réponses</li>
            <li>Utilisez des instructions dans vos projets pour guider l'IA</li>
            <li>Le formatage en Markdown est supporté dans les réponses</li>
          </ul>          
          <h4>Besoin d'aide supplémentaire?</h4>
          <p>
            Si vous avez d'autres questions ou rencontrez des problèmes, n'hésitez pas à 
            contacter notre équipe de support à <a href="mailto:support@clicktalk.com">support@clicktalk.com</a>
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;

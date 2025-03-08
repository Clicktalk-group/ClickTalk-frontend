// src/components/common/HeaderMenu/HeaderMenu.tsx
import React, { useRef, useEffect, useState } from 'react';
import { FaCog, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import { Modal } from '../Modal/Modal';
import './HeaderMenu.scss';

interface HeaderMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Ferme le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Ouvre la modale correspondante et ferme le menu
  const handleOpenModal = (modalName: string) => {
    setActiveModal(modalName);
    onClose();
  };

  // Ferme la modale active
  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      {isOpen && (
        <div className="header-menu-container">
          <div 
            ref={menuRef} 
            className="header-menu-dropdown"
          >
            <div className="menu-items">
              <button className="menu-item" onClick={() => handleOpenModal('settings')}>
                <FaCog />
                <span>Paramètres</span>
              </button>
              
              <button className="menu-item" onClick={() => handleOpenModal('help')}>
                <FaQuestionCircle />
                <span>Aide</span>
              </button>
              
              <button className="menu-item" onClick={() => handleOpenModal('logout')}>
                <FaSignOutAlt />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal paramètres */}
      <Modal
        isOpen={activeModal === 'settings'}
        onClose={handleCloseModal}
        title="Paramètres"
        size="md"
      >
        <div className="settings-modal-content">
          <h3>Paramètres utilisateur</h3>
          <p>
            Ici vous pouvez configurer vos préférences d'utilisation de l'application.
          </p>
          <div className="settings-section">
            <h4>Thème</h4>
            <div className="theme-options">
              <button className="theme-button active">Clair</button>
              <button className="theme-button">Sombre</button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal aide */}
      <Modal
        isOpen={activeModal === 'help'}
        onClose={handleCloseModal}
        title="Aide ClickTalk"
        size="md"
      >
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
        </div>
      </Modal>

      {/* Modal déconnexion */}
      <Modal
        isOpen={activeModal === 'logout'}
        onClose={handleCloseModal}
        title="Déconnexion"
        size="sm"
      >
        <div className="logout-modal-content">
          <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
          <div className="button-group">
            <button 
              className="cancel-button" 
              onClick={handleCloseModal}
            >
              Annuler
            </button>
            <button 
              className="confirm-button" 
              onClick={() => {
                logout();
                handleCloseModal();
              }}
            >
              Confirmer
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default HeaderMenu;

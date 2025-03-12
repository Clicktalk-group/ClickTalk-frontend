// src/components/common/HeaderMenu/HeaderMenu.tsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { FaUserCircle, FaPalette, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../../hooks/useAuth/useAuth';
import { Modal } from '../Modal/Modal';
import AccountModalContent from '../../modals/AccountModal/AccountModal';
import ThemeModalContent from '../../modals/ThemeModal/ThemeModal';
import HelpModalContent from '../../modals/HelpModal/HelpModal';
import './HeaderMenu.scss';

interface HeaderMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  // Mémorise les gestionnaires d'événements pour éviter les re-renders
  const handleOpenModal = useCallback((modalName: string) => {
    setActiveModal(modalName);
    onClose();
  }, [onClose]);

  const handleCloseModal = useCallback(() => {
    setActiveModal(null);
  }, []);
  
  const handleLogout = useCallback(() => {
    logout();
    handleCloseModal();
  }, [logout, handleCloseModal]);

  // Gère les clics en dehors du menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      
      // Focus trap - Concentre le premier élément du menu
      if (menuRef.current) {
        const firstButton = menuRef.current.querySelector('button');
        if (firstButton) {
          firstButton.focus();
        }
      }
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && (
        <div 
          className="header-menu-container" 
          role="menu" 
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
        >
          <div 
            ref={menuRef} 
            className="header-menu-dropdown"
          >
            <div className="menu-items">
              <button 
                className="menu-item" 
                onClick={() => handleOpenModal('account')}
                role="menuitem"
                tabIndex={0}
                aria-label="Compte utilisateur"
              >
                <FaUserCircle aria-hidden="true" />
                <span>Compte</span>
              </button>
              
              <button 
                className="menu-item" 
                onClick={() => handleOpenModal('theme')}
                role="menuitem"
                tabIndex={0}
                aria-label="Personnalisation du thème"
              >
                <FaPalette aria-hidden="true" />
                <span>Thème</span>
              </button>
              
              <button 
                className="menu-item" 
                onClick={() => handleOpenModal('help')}
                role="menuitem"
                tabIndex={0}
                aria-label="Aide et assistance"
              >
                <FaQuestionCircle aria-hidden="true" />
                <span>Aide</span>
              </button>
              
              <button 
                className="menu-item" 
                onClick={() => handleOpenModal('logout')}
                role="menuitem"
                tabIndex={0}
                aria-label="Déconnexion"
              >
                <FaSignOutAlt aria-hidden="true" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Compte */}
      <Modal
        isOpen={activeModal === 'account'}
        onClose={handleCloseModal}
        title="Compte utilisateur"
        size="md"
      >
        <AccountModalContent onClose={handleCloseModal} />
      </Modal>

      {/* Modal Thème */}
      <Modal
        isOpen={activeModal === 'theme'}
        onClose={handleCloseModal}
        title="Personnalisation du thème"
        size="md"
      >
        <ThemeModalContent onClose={handleCloseModal} />
      </Modal>

      {/* Modal aide */}
      <Modal
        isOpen={activeModal === 'help'}
        onClose={handleCloseModal}
        title="Aide ClickTalk"
        size="md"
      >
        <HelpModalContent onClose={handleCloseModal} />
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
              aria-label="Annuler la déconnexion"
            >
              Annuler
            </button>
            <button 
              className="confirm-button" 
              onClick={handleLogout}
              aria-label="Confirmer la déconnexion"
            >
              Confirmer
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default React.memo(HeaderMenu);

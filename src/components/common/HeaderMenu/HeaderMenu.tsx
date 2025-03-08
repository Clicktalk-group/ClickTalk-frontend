// src/components/common/HeaderMenu/HeaderMenu.tsx
import React, { useRef, useEffect, useState } from 'react';
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
              <button className="menu-item" onClick={() => handleOpenModal('account')}>
                <FaUserCircle />
                <span>Compte</span>
              </button>
              
              <button className="menu-item" onClick={() => handleOpenModal('theme')}>
                <FaPalette />
                <span>Thème</span>
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

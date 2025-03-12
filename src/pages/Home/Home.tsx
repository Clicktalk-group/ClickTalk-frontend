// src/pages/Home/Home.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.scss';
import ChatContainer from '../../components/chat/ChatContainer/ChatContainer';
import { Modal } from '../../components/common/Modal/Modal';
import ThemeModalContent from '../../components/modals/ThemeModal/ThemeModal';

const Home: React.FC = () => {
  // État pour suivre si nous sommes en mode chat complet (uniquement après envoi d'un message)
  const [chatMode, setChatMode] = useState(false);
  // État pour la modale de thème
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const navigate = useNavigate();
  
  // Utilisation de useCallback pour optimiser la fonction
  const activateChatMode = useCallback(() => {
    console.log('Activating chat mode');
    // Utilisation d'une fonction d'état pour être sûr d'avoir la valeur la plus récente
    setChatMode(true);
  }, []);

  // Fonction pour créer un nouveau projet en s'inspirant du Sidebar
  const handleCreateProject = useCallback(() => {
    // Fonction similaire à onNewProject du Sidebar
    // Cette fonction devrait probablement ouvrir une modale ou rediriger
    // vers la page projet avec un ID temporaire ou "new"
    navigate('/project/new');
  }, [navigate]);

  // Ouverture/fermeture de la modale de thème (comme dans HeaderMenu)
  const handleOpenThemeModal = useCallback(() => {
    setThemeModalOpen(true);
  }, []);

  const handleCloseThemeModal = useCallback(() => {
    setThemeModalOpen(false);
  }, []);

  // Mémoïsation des éléments de l'introduction pour éviter les recreations inutiles
  const introContent = useMemo(() => {
    if (chatMode) return null;
    
    return (
      <>
        <h1>Bienvenue sur ClickTalk</h1>
        <p>Votre plateforme de conversation intelligente.</p>

        <div className="quick-actions">
          <h2>Actions rapides</h2>
          <ul>
            {/* Utiliser la même fonction que le bouton "Nouveau Projet" dans Sidebar */}
            <li className="action-item" onClick={handleCreateProject}>Créer un nouveau projet</li>
            <li className="action-item" onClick={handleOpenThemeModal}>Configurer vos préférences</li>
          </ul>
        </div>
      </>
    );
  }, [chatMode, handleCreateProject, handleOpenThemeModal]);

  // Classe CSS optimisée avec useMemo pour éviter les recalculs inutiles
  const pageClassName = useMemo(() => 
    `home-page ${chatMode ? 'chat-mode' : ''}`,
    [chatMode]
  );

  console.log('Rendering Home page, chat mode:', chatMode);

  return (
    <div className={pageClassName}>
      {introContent}
      <ChatContainer onMessageSent={activateChatMode} />
      
      {/* Modal Thème - exactement comme dans HeaderMenu */}
      <Modal
        isOpen={themeModalOpen}
        onClose={handleCloseThemeModal}
        title="Personnalisation du thème"
        size="md"
      >
        <ThemeModalContent onClose={handleCloseThemeModal} />
      </Modal>
    </div>
  );
};

export default React.memo(Home);

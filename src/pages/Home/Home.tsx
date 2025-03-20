// src/pages/Home/Home.tsx
import React, { useState, useCallback, useMemo, lazy, Suspense } from 'react';
import './Home.scss';
import ChatContainer from '../../components/chat/ChatContainer/ChatContainer';
import { Modal } from '../../components/common/Modal/Modal';
import ThemeModalContent from '../../components/modals/ThemeModal/ThemeModal';

// Lazy loaded components - identique à MainLayout
const ProjectForm = lazy(() => import('../../components/project/ProjectForm/ProjectForm'));

// Fallback pour le ProjectForm
const FormLoading = () => (
  <div className="form-loading">
    <div className="spinner"></div>
    <p>Chargement du formulaire...</p>
  </div>
);

const Home: React.FC = () => {
  // État pour suivre si nous sommes en mode chat complet (uniquement après envoi d'un message)
  const [chatMode, setChatMode] = useState(false);
  // État pour la modale de thème
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  // État pour la modale de projet - comme dans MainLayout
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  
  // Utilisation de useCallback pour optimiser la fonction
  const activateChatMode = useCallback(() => {
    console.log('Activating chat mode');
    // Utilisation d'une fonction d'état pour être sûr d'avoir la valeur la plus récente
    setChatMode(true);
  }, []);

  // Fonction pour créer un nouveau projet
  const handleCreateProject = useCallback(() => {
    console.log("Nouveau projet");
    setEditingProject(null); // Assurez-vous de ne pas être en mode édition
    setShowProjectForm(true); // Afficher le formulaire de création
  }, []);

  // Fonction pour fermer le formulaire de projet - identique à handleCloseProjectForm dans MainLayout
  const handleCloseProjectForm = useCallback(() => {
    setShowProjectForm(false);
    setEditingProject(null);
    // Rafraîchir les projets après la fermeture du formulaire
  }, []);

  // Ouverture/fermeture de la modale de thème
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
      
      {/* Modal Thème */}
      <Modal
        isOpen={themeModalOpen}
        onClose={handleCloseThemeModal}
        title="Personnalisation du thème"
        size="md"
      >
        <ThemeModalContent onClose={handleCloseThemeModal} />
      </Modal>
      
      {/* Modal pour la création/édition de projet - exactement comme dans MainLayout */}
      {showProjectForm && (
        <div className="modal-overlay">
          <div className="modal-container">
            <Suspense fallback={<FormLoading />}>
              <ProjectForm 
                onClose={handleCloseProjectForm} 
                initialData={editingProject}
              />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(Home);

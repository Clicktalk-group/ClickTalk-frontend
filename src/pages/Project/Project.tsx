import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '../../hooks/useProject/useProject';
import ChatContainer from '../../components/chat/ChatContainer/ChatContainer';
import ProjectForm from '../../components/project/ProjectForm/ProjectForm';
import { Modal } from '../../components/common/Modal';
import { ProjectSidebar } from '../../components/project/ProjectSidebar/ProjectSidebar';
import { ProjectContextPopup } from '../../components/project/ProjectContextPopup/ProjectContextPopup';
import { Button } from '../../components/common/Button';
import { FaBars, FaFileAlt, FaHome } from 'react-icons/fa';
import './Project.scss';
import { conversationService } from '../../services/conversation/conversation';

const Project: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  // États locaux
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [contextPopupOpen, setContextPopupOpen] = useState(false);

  // Hooks projet et conversations
  const {projects, deleteProject,currentConversationId,setCurrentConversationId,deleteConversationFromProject,loading } = useProject();
  
  const isNewConversation = !currentConversationId;
  const projectConversations = projects.find(p => p.id === Number(projectId))?.conversations || [];


  // Rechercher le projet actuel dans la liste des projets
  const currentProjectData = projectId ? projects.find(p => p.id === Number(projectId)) : null;

  // Gérer la création de nouvelle conversation
  const handleNewConversation = () => {
    setCurrentConversationId(null);
    
    // Fermer la sidebar sur mobile après sélection
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };


  // Toggle de la sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Toggle du popup de contexte
  const toggleContextPopup = () => {
    setContextPopupOpen(!contextPopupOpen);
  };

  // Sélectionner une conversation existante
  const handleSelectConversation = (conversationId: number) => {
    setCurrentConversationId(conversationId);
    // Fermer la sidebar sur mobile après sélection
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  // Supprimer une conversation
  const handleRemoveConversation = async (conversationId: number) => {
    try {
      if (!projectId) {
        throw new Error("Project ID is missing");
      }
      
      await deleteConversationFromProject(Number(projectId), conversationId);
      await conversationService.deleteConversation(conversationId);
      
      setError(null);
      return true;
    } catch (error: any) {
      console.error("Erreur lors de la suppression de la conversation du projet:", error);
      setError(`Erreur de suppression: ${error.message || "Contactez l'administrateur"}`);
      return false;
    }
  };

  // Ouvrir le modal d'édition
  const handleEditProject = () => {
    setShowEditModal(true);
  };

  // Fermer le modal d'édition
  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  // Supprimer le projet
  const handleDeleteProject = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le projet "${currentProjectData?.title}" et toutes ses conversations ?`)) {
      try {
        if (projectId) {
          await deleteProject(Number(projectId));
          navigate('/');
        }
      } catch (error: any) {
        console.error("Erreur lors de la suppression du projet:", error);
        setError(`Erreur lors de la suppression: ${error.message || "Contactez l'administrateur"}`);
      }
    }
  };

  // Gestion du chargement
  if (loading) {
    return <div className="loading-container">Chargement du projet...</div>;
  }

  // Vérifier si le projet existe
  if (!currentProjectData) {
    return (
      <div className="project-not-found">
        <h2>Projet non trouvé</h2>
        <p>Le projet que vous recherchez n'existe pas ou a été supprimé.</p>
        <Button onClick={() => navigate('/')} variant="primary">
          <FaHome /> Retour à l'accueil
        </Button>
      </div>
    );
  }

  // Récupération du titre de la conversation courante
  const getActiveConversationTitle = () => {
    if (isNewConversation) return "Nouvelle conversation";
    const activeConversation = projectConversations.find(c => c.id === currentConversationId);
    return activeConversation?.title || "Sélectionner une conversation";
  };

  // Vérifier si on est sur l'écran d'accueil (message "Sélectionnez une conversation...")
  const isWelcomeScreenShown = !isNewConversation && !currentConversationId;

  return (
    <div className="project-page">
      <div className="project-content">
        {/* Sidebar rétractable avec le project header maintenant à l'intérieur */}
        <div className={`project-sidebar-container ${sidebarOpen ? 'open' : 'closed'}`}>
          <ProjectSidebar
            projectId={Number(projectId)}
            projectData={currentProjectData ? {
              title: currentProjectData.title,
              context: currentProjectData.context
            } : undefined}
            projectConversations={projectConversations}
            onNewConversation={handleNewConversation}
            onSelectConversation={handleSelectConversation}
            onRemoveConversation={handleRemoveConversation}
            selectedConversationId={currentConversationId}
            onClose={toggleSidebar}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
            error={error}
            showWelcomeScreen={isWelcomeScreenShown} // Passer l'état du message d'accueil à la sidebar
          />
        </div>
        
        <div className="project-chat-area">
          {/* Barre d'outils maintenant visible sur tous les formats */}
          <div className="mobile-toolbar">
            <Button 
              variant="ghost"
              onClick={toggleSidebar}
              className="sidebar-toggle"
              title={sidebarOpen ? "Masquer la liste" : "Afficher la liste"}
            >
              <FaBars />
            </Button>
            
            <div className="active-conversation-title">
              {getActiveConversationTitle()}
            </div>
            
            <Button
              variant="ghost"
              onClick={toggleContextPopup}
              className="context-toggle"
              title="Afficher le contexte du projet"
            >
              <FaFileAlt />
            </Button>
          </div>
            <ChatContainer projectId={Number(projectId)} conversationId={currentConversationId|| undefined} />
        </div>
      </div>

      {/* Modal d'édition du projet */}
      {showEditModal && (
        <Modal isOpen={showEditModal} onClose={handleCloseEditModal} title="Modifier le projet">
          <ProjectForm
            onClose={handleCloseEditModal}
            initialData={{
              id: currentProjectData.id,
              title: currentProjectData.title,
              context: currentProjectData.context
            }}
          />
        </Modal>
      )}

      {/* Popup de contexte (visible uniquement en mode mobile) */}
      <ProjectContextPopup
        isOpen={contextPopupOpen}
        onClose={toggleContextPopup}
        context={currentProjectData.context || "Aucun contexte défini pour ce projet."}
        title={currentProjectData.title}
      />
    </div>
  );
};

export default Project;

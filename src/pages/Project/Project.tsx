// /src/pages/Project/Project.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '../../hooks/useProject/useProject';
import { useConversation } from '../../hooks/useConversation/useConversation';
import { Project as ProjectType } from '../../types/project.types';
import { Conversation } from '../../types/conversation.types';
import ChatContainer from '../../components/chat/ChatContainer/ChatContainer';
import ProjectForm from '../../components/project/ProjectForm/ProjectForm';
import { Modal } from '../../components/common/Modal';
import './Project.scss';
import { FaPlus, FaEdit } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth/useAuth';
import ConversationProjectList from '../../components/project/ConversationProjectList/ConversationProjectList';

const Project: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isNewConversation, setIsNewConversation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  
  const { 
    projects,
    currentProject,
    fetchProjects,
    updateProject,
    deleteProject,
    removeConversationFromProject
  } = useProject();
  
  const {
    deleteConversation,
    fetchProjectConversations
  } = useConversation();

  // Rechercher le projet actuel dans la liste des projets
  const currentProjectData = projectId ? projects.find(p => p.id === Number(projectId)) : null;

  // Effet pour gérer le chargement initial
  useEffect(() => {
    if (!projectId) {
      navigate('/');
      return;
    }
    
    // Une fois que les projets sont chargés, arrêter le chargement
    if (projects.length >= 0) {
      setIsLoading(false);
    }
  }, [projectId, navigate, projects]);

  // Gérer la création de nouvelle conversation
  const handleNewConversation = () => {
    setIsNewConversation(true);
    setCurrentConversationId(null);
  };

  // Sélectionner une conversation existante
  const handleSelectConversation = (conversationId: number) => {
    setCurrentConversationId(conversationId);
    setIsNewConversation(false);
  };

  // Supprimer une conversation - CORRECTION ICI
  const handleRemoveConversation = async (conversationId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette conversation du projet ?")) {
      try {
        if (!projectId) {
          throw new Error("Project ID is missing");
        }
        
        console.log(`Attempting to remove conversation ${conversationId} from project ${projectId}`);
        await removeConversationFromProject(Number(projectId), conversationId);
        console.log('Conversation removed successfully');
        
        // Si c'était la conversation actuellement ouverte, revenir à l'écran de sélection
        if (currentConversationId === conversationId) {
          setCurrentConversationId(null);
          setIsNewConversation(false);
        }
        
        // Forcer le rafraîchissement des conversations du projet
        if (fetchProjectConversations) {
          fetchProjectConversations(Number(projectId));
        }
      } catch (error) {
        console.error("Erreur lors de la suppression de la conversation du projet:", error);
        alert("Une erreur est survenue lors de la suppression de la conversation. Veuillez réessayer.");
      }
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
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le projet "${currentProjectData?.title}" ?`)) {
      try {
        if (projectId) {
          await deleteProject(Number(projectId));
          navigate('/');
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du projet:", error);
      }
    }
  };

  // Gestion du chargement
  if (isLoading) {
    return <div className="loading-container">Chargement du projet...</div>;
  }

  // Vérifier si le projet existe
  if (!currentProjectData) {
    return (
      <div className="project-not-found">
        <h2>Projet non trouvé</h2>
        <p>Le projet que vous recherchez n'existe pas ou a été supprimé.</p>
        <button onClick={() => navigate('/')}>Retour à l'accueil</button>
      </div>
    );
  }

  return (
    <div className="project-page">
      <div className="project-header">
        <div className="project-title-container">
          <h1>{currentProjectData.title}</h1>
          <div className="project-actions">
            <button className="edit-btn" onClick={handleEditProject} title="Modifier le projet">
              <FaEdit />
            </button>
            <button className="delete-btn" onClick={handleDeleteProject} title="Supprimer le projet">
              Supprimer
            </button>
          </div>
        </div>
        {currentProjectData.context && (
          <p className="project-context">{currentProjectData.context}</p>
        )}
      </div>
      
      <div className="project-content">
        <div className="project-sidebar">
          <button className="new-conv-btn" onClick={handleNewConversation}>
            <FaPlus /> Nouvelle conversation
          </button>
          
          {projectId && (
            <ConversationProjectList 
              projectId={Number(projectId)}
              onSelect={handleSelectConversation}
              onRemove={handleRemoveConversation}
            />
          )}
        </div>
        
        <div className="project-chat-area">
          {isNewConversation ? (
            <ChatContainer projectId={Number(projectId)} />
          ) : currentConversationId ? (
            <ChatContainer projectId={Number(projectId)} conversationId={currentConversationId} />
          ) : (
            <div className="select-conversation-msg">
              <p>Sélectionnez une conversation ou créez-en une nouvelle</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal d'édition du projet */}
      {showEditModal && (
        <Modal isOpen={showEditModal} onClose={handleCloseEditModal} title="Modifier le projet">
          <ProjectForm
            onClose={handleCloseEditModal}
            userId={user?.id}
            initialData={{
              id: currentProjectData.id,
              title: currentProjectData.title,
              context: currentProjectData.context
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default Project;

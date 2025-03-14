import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '../../hooks/useProject/useProject';
import ChatContainer from '../../components/chat/ChatContainer/ChatContainer';
import ProjectForm from '../../components/project/ProjectForm/ProjectForm';
import { Modal } from '../../components/common/Modal';
import { ProjectSidebar } from '../../components/project/ProjectSidebar/ProjectSidebar';
import { ProjectContextPopup } from '../../components/project/ProjectContextPopup/ProjectContextPopup';
import { Button } from '../../components/common/Button';
import { FaEdit, FaHome, FaBars, FaFileAlt } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth/useAuth';
import './Project.scss';

const Project: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // États locaux
  const [isNewConversation, setIsNewConversation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [contextPopupOpen, setContextPopupOpen] = useState(false);
  const [projectConversations, setProjectConversations] = useState<any[]>([]);

  // Hooks projet et conversations
  const {
    projects,
    fetchProjects,
    fetchProjectById,
    deleteProject,
    removeConversationFromProject,
    getProjectConversations
  } = useProject();

  // Charger le projet spécifique quand l'ID est disponible
  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        navigate('/');
        return;
      }

      setIsLoading(true);
      try {
        // Chercher d'abord dans la liste existante
        const existingProject = projects.find(p => p.id === Number(projectId));
        
        if (existingProject) {
          setIsLoading(false);
        } else {
          // Si pas trouvé, charger depuis l'API
          if (fetchProjectById) {
            await fetchProjectById(Number(projectId));
          } else {
            await fetchProjects();
          }
        }

        // Charger les conversations du projet en utilisant le bon endpoint
        try {
          // Utiliser la fonction du hook useProject qui utilise l'endpoint correct
          const conversations = await getProjectConversations(Number(projectId));
          setProjectConversations(Array.isArray(conversations) ? conversations : []);
        } catch (convError) {
          console.error("Error loading project conversations:", convError);
        }
        
        setError(null);
      } catch (error: any) {
        console.error("Error loading project:", error);
        setError(`Erreur de chargement: ${error.message || "Contactez l'administrateur"}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProject();
  }, [projectId, navigate, fetchProjectById, fetchProjects, projects, getProjectConversations]);

  // Rechercher le projet actuel dans la liste des projets
  const currentProjectData = projectId ? projects.find(p => p.id === Number(projectId)) : null;

  // Gérer la création de nouvelle conversation
  const handleNewConversation = () => {
    setIsNewConversation(true);
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
    setIsNewConversation(false);
    
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
      
      // On utilise maintenant une fonction qui supprime directement la conversation
      // et non plus une fonction qui essaie de la retirer d'un projet
      await removeConversationFromProject(Number(projectId), conversationId);
      
      // Si c'était la conversation actuellement ouverte, revenir à l'écran de sélection
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
        setIsNewConversation(false);
      }
      
      // Mettre à jour la liste des conversations du projet
      setProjectConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      setError(null);
      return true;
    } catch (error: any) {
      console.error("Erreur lors de la suppression de la conversation:", error);
      setError(`Erreur de suppression: ${error.message || "Contactez l'administrateur"}`);
      return false;
    }
  };

  // Naviguer vers la page d'accueil
  const handleGoHome = () => {
    navigate('/');
  };

  // Ouvrir le modal d'édition
  const handleEditProject = () => {
    setShowEditModal(true);
  };

  // Fermer le modal d'édition
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    // Rafraîchir les données du projet après modifications
    if (projectId && fetchProjectById) {
      fetchProjectById(Number(projectId));
    }
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
  if (isLoading) {
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

  return (
    <div className="project-page">
      <div className="project-header">
        {/* Bouton de retour à l'accueil */}
        <div className="back-to-home">
          <Button 
            variant="ghost" 
            onClick={handleGoHome}
            className="home-button"
            title="Retour à l'accueil"
          >
            <FaHome /> Accueil
          </Button>
        </div>
        
        <div className="project-title-container">
          <h1>{currentProjectData.title}</h1>
          <div className="project-actions">
            <Button 
              variant="secondary"
              onClick={handleEditProject}
              title="Modifier le projet"
            >
              <FaEdit /> Modifier
            </Button>
            <Button 
              variant="danger"
              onClick={handleDeleteProject}
              title="Supprimer le projet"
            >
              Supprimer
            </Button>
          </div>
        </div>
        {currentProjectData.context && (
          <p className="project-context">{currentProjectData.context}</p>
        )}
        {error && <div className="error-notification">{error}</div>}
      </div>
      
      <div className="project-content">
        {/* Sidebar rétractable */}
        <div className={`project-sidebar-container ${sidebarOpen ? 'open' : 'closed'}`}>
          <ProjectSidebar
            projectId={Number(projectId)}
            onNewConversation={handleNewConversation}
            onSelectConversation={handleSelectConversation}
            onRemoveConversation={handleRemoveConversation}
            selectedConversationId={currentConversationId}
            onClose={toggleSidebar}
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
          
          {/* Zone de chat */}
          {isNewConversation ? (
            <ChatContainer projectId={Number(projectId)} />
          ) : currentConversationId ? (
            <ChatContainer projectId={Number(projectId)} conversationId={currentConversationId} />
          ) : (
            <div className="select-conversation-msg">
              <p>Sélectionnez une conversation ou créez-en une nouvelle</p>
              <Button 
                variant="primary"
                onClick={handleNewConversation}
              >
                Démarrer une nouvelle conversation
              </Button>
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

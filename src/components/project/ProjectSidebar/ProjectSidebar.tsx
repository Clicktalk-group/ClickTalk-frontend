import React, { useEffect, useState, useCallback, memo } from "react";
import { Button } from "../../common/Button";
import { FaPlus, FaTimes, FaTrash, FaComment, FaEdit, FaHome } from 'react-icons/fa';
import { projectService } from '../../../services/project/project';
import { useNavigate } from 'react-router-dom';
import './ProjectSidebar.scss';

// Type défini pour la conversation pour améliorer la performance du rendu
interface ConversationItem {
  id: number;
  convId?: number;
  title: string;
  createdAt: string;
  created_at?: string;
}

interface ProjectSidebarProps {
  projectId: number;
  projectData?: {
    title: string;
    context?: string;
  };
  projectConversations: ConversationItem[];
  onNewConversation: () => void;
  onSelectConversation: (id: number) => void;
  onRemoveConversation: (id: number) => Promise<boolean>;
  selectedConversationId: number | null;
  onClose: () => void;
  onEditProject: () => void;
  onDeleteProject: () => void;
  error?: string | null;
  showWelcomeScreen: boolean; // Nouvelle prop pour savoir si le message d'accueil est affiché
}

// Utilisation de memo pour éviter les re-rendus inutiles
export const ProjectSidebar: React.FC<ProjectSidebarProps> = memo(
  ({
    projectData,
    projectConversations,
    onNewConversation,
    onSelectConversation,
    onRemoveConversation,
    selectedConversationId,
    onClose,
    onEditProject,
    onDeleteProject,
    error,
    showWelcomeScreen,
  }) => {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // États locaux
  const [loading, setLoading] = useState(false);
  const [sidebarError, setSidebarError] = useState<string | null>(null);
  
  // Détecter si on est sur mobile ou non
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRemove = useCallback(async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette conversation ?')) {
       await onRemoveConversation(id);
    }
  }, []);

  const formatDate = useCallback((dateString?: string): string => {
    if (!dateString) return 'Date inconnue';
    
    try {
      const date = new Date(dateString);
      // Vérifier si la date est valide
      if (isNaN(date.getTime())) return 'Date inconnue';
      
      return date.toLocaleDateString("fr-FR");
    } catch (e) {
      return 'Date inconnue';
    }
  }, []);
  
  const handleGoHome = () => {
    navigate('/');
  };

  // Optimisation du rendu conditionnel pour éviter les calculs inutiles
  const renderContent = () => {
    if (loading) {
      return <div className="sidebar-loading" role="status" aria-live="polite">Chargement des conversations...</div>;
    }
    
    if (sidebarError ) {
      return <div className="sidebar-error" role="alert">{sidebarError}</div>;
    }
    
    if (!projectConversations || projectConversations.length === 0) {
      return (
        <div className="empty-conversations">
          Aucune conversation. Créez-en une nouvelle pour commencer.
        </div>
      );
    }
    
    return (
      <div className="conversations-list" role="list">
        {projectConversations.map((conversation) => {
          const conversationId = conversation.id || conversation.convId || 0;
          const title = conversation.title || `Conversation #${conversationId}`;
          
          return (
            <div 
              key={conversationId}
              className={`conversation-item ${selectedConversationId === conversationId ? 'active' : ''}`}
              onClick={() => onSelectConversation(conversationId)}
              role="listitem"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectConversation(conversationId);
                }
              }}
            >
              <div className="conversation-info">
                <div className="conversation-icon" aria-hidden="true">
                  <FaComment />
                </div>
                <div className="conversation-details">
                  <div className="conversation-title" title={title}>
                    {title}
                  </div>
                  <div className="conversation-date">
                    {formatDate(conversation.createdAt || conversation.created_at)}
                  </div>
                </div>
              </div>
              <button 
                className="delete-conversation" 
                onClick={(e) => handleRemove(e, conversationId)}
                title="Supprimer cette conversation"
                aria-label={`Supprimer la conversation ${title}`}
              >
                <FaTrash aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  // Déterminer si on montre le bouton "Nouvelle conversation" dans la sidebar
  // En version mobile: toujours afficher le bouton
  // En version desktop: afficher uniquement si l'écran d'accueil n'est pas visible
  const shouldShowNewConversationButton = isMobile || !showWelcomeScreen;

  return (
    <div className="project-sidebar" role="complementary" aria-label="Conversations du projet">
      {/* Project Header intégré dans la sidebar */}
      <div className="project-header">
        <div className="header-top">
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
          
          <Button 
            variant="ghost"
            className="close-sidebar"
            onClick={onClose}
            title="Masquer la liste des conversations"
            aria-label="Fermer la barre latérale"
          >
            <FaTimes aria-hidden="true" />
          </Button>
        </div>
        
        {projectData && (
          <>
            <div className="project-title-container">
              <h1>{projectData.title}</h1>
              <div className="project-actions">
                <Button 
                  variant="secondary"
                  onClick={onEditProject}
                  title="Modifier le projet"
                >
                  <FaEdit /> Modifier
                </Button>
                <Button 
                  variant="danger"
                  onClick={onDeleteProject}
                  title="Supprimer le projet"
                >
                  Supprimer
                </Button>
              </div>
            </div>
            
            {projectData.context && (
              <p className="project-context">{projectData.context}</p>
            )}
          </>
        )}
        
        {error && <div className="error-notification">{error}</div>}
      </div>

      <div className="sidebar-header">
        <h2 id="conversation-list-title">Conversations</h2>
      </div>

      {/* Bouton pour nouvelle conversation - comportement dépendant du device */}
      {shouldShowNewConversationButton && (
        <Button 
          variant="primary" 
          className="new-conversation-btn" 
          onClick={onNewConversation}
          fullWidth
          aria-label="Créer une nouvelle conversation"
        >
          <FaPlus aria-hidden="true" /> Nouvelle conversation
        </Button>
      )}
      
      {renderContent()}
    </div>
  );
});

// Ajouter displayName pour les DevTools React
ProjectSidebar.displayName = 'ProjectSidebar';

export default ProjectSidebar;

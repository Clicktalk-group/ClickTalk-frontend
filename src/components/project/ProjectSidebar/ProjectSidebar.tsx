import React, { useEffect, useState } from 'react';
import { useConversation } from '../../../hooks/useConversation/useConversation';
import { Button } from '../../common/Button';
import { FaPlus, FaTimes, FaTrash, FaComment } from 'react-icons/fa';
import { projectService } from '../../../services/project/project';
import './ProjectSidebar.scss';

interface ProjectSidebarProps {
  projectId: number;
  onNewConversation: () => void;
  onSelectConversation: (id: number) => void;
  onRemoveConversation: (id: number) => Promise<boolean>;
  selectedConversationId: number | null;
  onClose: () => void;
}

export const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  projectId,
  onNewConversation,
  onSelectConversation,
  onRemoveConversation,
  selectedConversationId,
  onClose,
}) => {
  const { 
    loading: convLoading, 
    error: convError, 
    fetchConversations
  } = useConversation();

  // États locaux
  const [projectConversations, setProjectConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les conversations du projet
  useEffect(() => {
    const loadProjectConversations = async () => {
      if (!projectId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Utilisation correcte du service project pour obtenir les conversations
        const conversations = await projectService.getProjectConversations(projectId);
        
        if (Array.isArray(conversations)) {
          setProjectConversations(conversations);
        } else {
          console.warn("Format de données inattendu:", conversations);
          setProjectConversations([]);
        }
      } catch (err: any) {
        console.error("Erreur lors du chargement des conversations du projet:", err);
        setError(err?.message || "Erreur lors du chargement des conversations");
        setProjectConversations([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadProjectConversations();
    // On charge aussi toutes les conversations au cas où
    fetchConversations();
  }, [projectId, fetchConversations]);

  const handleRemove = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette conversation ?')) {
      const success = await onRemoveConversation(id);
      if (success) {
        // Mettre à jour la liste des conversations après suppression
        setProjectConversations(prev => prev.filter(conv => conv.id !== id));
      }
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Date inconnue';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return 'Date inconnue';
    }
  };

  return (
    <div className="project-sidebar">
      <div className="sidebar-header">
        <h2>Conversations</h2>
        <Button 
          variant="ghost"
          className="close-sidebar"
          onClick={onClose}
          title="Masquer la liste des conversations"
        >
          <FaTimes />
        </Button>
      </div>

      <Button 
        variant="primary" 
        className="new-conversation-btn" 
        onClick={onNewConversation}
        fullWidth
      >
        <FaPlus /> Nouvelle conversation
      </Button>
      
      {(loading || (convLoading && projectConversations.length === 0)) ? (
        <div className="sidebar-loading">Chargement des conversations...</div>
      ) : (error || convError) ? (
        <div className="sidebar-error">{error || convError}</div>
      ) : (
        <div className="conversations-list">
          {projectConversations && projectConversations.length > 0 ? (
            projectConversations.map((conversation) => (
              <div 
                key={conversation.id || conversation.convId}
                className={`conversation-item ${selectedConversationId === (conversation.id || conversation.convId) ? 'active' : ''}`}
                onClick={() => onSelectConversation(conversation.id || conversation.convId)}
              >
                <div className="conversation-info">
                  <div className="conversation-icon">
                    <FaComment />
                  </div>
                  <div className="conversation-details">
                    <div className="conversation-title">
                      {conversation.title || `Conversation #${conversation.id || conversation.convId}`}
                    </div>
                    <div className="conversation-date">
                      {formatDate(conversation.createdAt || conversation.created_at)}
                    </div>
                  </div>
                </div>
                <button 
                  className="delete-conversation" 
                  onClick={(e) => handleRemove(e, conversation.id || conversation.convId)}
                  title="Supprimer cette conversation"
                  aria-label={`Supprimer la conversation ${conversation.title || 'sans titre'}`}
                >
                  <FaTrash />
                </button>
              </div>
            ))
          ) : (
            <div className="empty-conversations">
              Aucune conversation. Créez-en une nouvelle pour commencer.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectSidebar;

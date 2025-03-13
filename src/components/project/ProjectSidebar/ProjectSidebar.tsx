import React, { useEffect, useState } from 'react';
import { useConversation } from '../../../hooks/useConversation/useConversation';
import { Button } from '../../common/Button';
import { FaPlus, FaTimes, FaTrash, FaComment } from 'react-icons/fa';
import { conversationService } from '../../../services/conversation/conversation';
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
    loading, 
    error, 
    fetchConversations
  } = useConversation();

  // État local pour stocker les conversations du projet
  const [projectConversations, setProjectConversations] = useState<any[]>([]);

  // Charger toutes les conversations, puis filtrer celles du projet
  useEffect(() => {
    const loadProjectConversations = async () => {
      try {
        if (projectId) {
          // Utiliser directement le service pour récupérer les conversations du projet
          const conversations = await conversationService.getProjectConversations(projectId);
          setProjectConversations(conversations);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des conversations du projet:", err);
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
      
      {loading && projectConversations.length === 0 ? (
        <div className="sidebar-loading">Chargement des conversations...</div>
      ) : error ? (
        <div className="sidebar-error">{error}</div>
      ) : (
        <div className="conversations-list">
          {projectConversations && projectConversations.length > 0 ? (
            projectConversations.map((conversation) => (
              <div 
                key={conversation.id}
                className={`conversation-item ${selectedConversationId === conversation.id ? 'active' : ''}`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="conversation-info">
                  <div className="conversation-icon">
                    <FaComment />
                  </div>
                  <div className="conversation-details">
                    <div className="conversation-title">{conversation.title}</div>
                    <div className="conversation-date">
                      {conversation.createdAt ? formatDate(conversation.createdAt) : 'Date inconnue'}
                    </div>
                  </div>
                </div>
                <button 
                  className="delete-conversation" 
                  onClick={(e) => handleRemove(e, conversation.id)}
                  title="Supprimer cette conversation"
                  aria-label={`Supprimer la conversation ${conversation.title}`}
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

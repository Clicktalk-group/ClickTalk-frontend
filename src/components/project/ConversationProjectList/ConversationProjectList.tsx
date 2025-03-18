import React, { useState, useEffect } from "react";
import { useProject } from "../../../hooks/useProject/useProject";
import { Conversation } from "../../../types/conversation.types";
import "./ConversationProjectList.scss";
import { FaTrash, FaComment } from "react-icons/fa";

interface ConversationProjectListProps {
  projectId: number;
  onSelect: (conversationId: number) => void;
  onRemove: (conversationId: number) => void;
}

// Interface étendue pour supporter les formats variés de l'API
interface ConversationResponse extends Partial<Conversation> {
  convId?: number; // Support pour le format alternatif possible
}

const ConversationProjectList: React.FC<ConversationProjectListProps> = ({
  projectId,
  onSelect,
  onRemove
}) => {
  // Utiliser aussi le hook useProject pour pouvoir utiliser getProjectConversations si disponible
  const { getProjectConversations } = useProject();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConversations = async () => {
      setIsLoading(true);
      try {
        if (projectId) {
          let data: ConversationResponse[] | undefined;

          try {
            data = (await getProjectConversations(
              projectId
            )) as ConversationResponse[];
          } catch (e) {
            console.error("Error loading project conversations:", e);
          }

          if (data && Array.isArray(data)) {
            const formattedConversations = data.map(conv => ({
              id: conv.id || (conv.convId as number), // Cast explicite pour satisfaire TypeScript
              title: conv.title || `Conversation #${conv.id || conv.convId}`,
              userId: conv.userId || 0,
              createdAt: conv.createdAt || new Date().toISOString(),
              updatedAt: conv.updatedAt
            }));
            
            setConversations(formattedConversations);
            setError(null);
          } else {
            setConversations([]);
            setError("Aucune conversation trouvée ou format de données non valide");
          }
        }
      } catch (error: any) {
        console.error('Error loading project conversations:', error);
        setError(`Erreur de chargement: ${error.message || 'Contactez l\'administrateur'}`);
        setConversations([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
  }, [projectId, getProjectConversations, isRemoving]);

  const handleRemoveClick = async (e: React.MouseEvent, conversationId: number) => {
    e.stopPropagation();
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette conversation? Cette action est irréversible.")) {
      try {
        setIsRemoving(true);
        await onRemove(conversationId);
        
        // Mettre à jour la liste locale après la suppression
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));
        setError(null);
      } catch (error: any) {
        console.error(`Error removing conversation ${conversationId}:`, error);
        setError(`Erreur lors de la suppression: ${error.message || 'Contactez l\'administrateur'}`);
      } finally {
        setIsRemoving(false);
      }
    }
  };

  if (isLoading) {
    return <div className="loading">Chargement des conversations...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!conversations.length) {
    return <div className="empty-list">Aucune conversation dans ce projet</div>;
  }

  return (
    <div className="conversation-project-list">
      <h3>Conversations</h3>
      <ul>
        {conversations.map(conversation => (
          <li key={conversation.id} onClick={() => onSelect(conversation.id)}>
            <div className="conversation-item">
              <FaComment className="icon" />
              <div className="conversation-info">
                <span className="title">{conversation.title || `Conversation #${conversation.id}`}</span>
                <span className="date">
                  {conversation.updatedAt || conversation.createdAt 
                    ? new Date(conversation.updatedAt || conversation.createdAt).toLocaleDateString()
                    : 'Date inconnue'}
                </span>
              </div>
            </div>
            <button 
              className="remove-btn"
              onClick={(e) => handleRemoveClick(e, conversation.id)}
              title="Supprimer cette conversation"
              disabled={isRemoving}
            >
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationProjectList;

import React, { useEffect } from "react";
import { useConversation } from "../../../hooks/useConversation/useConversation";
import { Conversation } from "../../../types/conversation.types";
import "./ConversationList.scss";
import { FaTrash, FaEdit } from "react-icons/fa";

interface ConversationListProps {
  onSelect: (id: number) => void;
  onDelete?: (id: number) => void;
  onEdit?: (conversation: Conversation) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ 
  onSelect, 
  onDelete,
  onEdit 
}) => {
  const { conversations, fetchConversations, loading, error } = useConversation();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  if (loading) {
    return <div className="loading">Chargement des conversations...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (conversations.length === 0) {
    return <div className="empty">Aucune conversation trouvée</div>;
  }

  return (
    <div className="conversation-list">
      <ul>
        {conversations.map((conversation) => (
          <li key={conversation.id} onClick={() => onSelect(conversation.id)}>
            <span className="title">{conversation.title}</span>
            {(onEdit || onDelete) && (
              <div className="actions">
                {onEdit && (
                  <button 
                    className="edit-btn" 
                    aria-label={`Modifier la conversation ${conversation.title}`}
                    title={`Modifier la conversation ${conversation.title}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(conversation);
                    }}
                  >
                    <FaEdit />
                  </button>
                )}
                {onDelete && (
                  <button 
                    className="delete-btn" 
                    aria-label={`Supprimer la conversation ${conversation.title}`}
                    title={`Supprimer la conversation ${conversation.title}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conversation.id);
                    }}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationList;

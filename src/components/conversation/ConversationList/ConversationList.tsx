import React, { useEffect, useCallback, useState, useMemo } from "react";
import { useConversation } from "../../../hooks/useConversation/useConversation";
import { Conversation } from "../../../types/conversation.types";
import "./ConversationList.scss";
import { FaTrash, FaEdit } from "react-icons/fa";

interface ConversationListProps {
  onSelect: (id: number) => void;
  onDelete?: (id: number) => void;
  onEdit?: (conversation: Conversation) => void;
}

const ConversationList = React.memo(({ 
  onSelect, 
  onDelete,
  onEdit 
}: ConversationListProps) => {
  const { conversations, fetchConversations, loading, error } = useConversation();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Utilisation de useEffect avec fetchConversations qui est mémoïsé par le hook
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Optimisation du gestionnaire d'événements de sélection de conversation
  const handleSelect = useCallback((id: number) => {
    setSelectedId(id);
    onSelect(id);
  }, [onSelect]);

  // Optimisation du gestionnaire d'événements de suppression
  const handleDelete = useCallback((id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  }, [onDelete]);

  // Optimisation du gestionnaire d'événements d'édition
  const handleEdit = useCallback((conversation: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(conversation);
    }
  }, [onEdit]);

  // Rendu conditionnel mémoïsé
  const renderContent = useMemo(() => {
    if (loading) {
      return <div className="loading" role="status">Chargement des conversations...</div>;
    }

    if (error) {
      return <div className="error" role="alert">{error}</div>;
    }

    if (conversations.length === 0) {
      return <div className="empty">Aucune conversation trouvée</div>;
    }

    return (
      <ul>
        {conversations.map((conversation) => (
          <li 
            key={conversation.id} 
            onClick={() => handleSelect(conversation.id)}
            className={selectedId === conversation.id ? 'selected' : ''}
            data-selected={selectedId === conversation.id}
          >
            <span className="title">{conversation.title}</span>
            {(onEdit || onDelete) && (
              <div className="actions">
                {onEdit && (
                  <button 
                    className="edit-btn" 
                    aria-label={`Modifier la conversation ${conversation.title}`}
                    title={`Modifier la conversation ${conversation.title}`}
                    onClick={(e) => handleEdit(conversation, e)}
                  >
                    <FaEdit />
                  </button>
                )}
                {onDelete && (
                  <button 
                    className="delete-btn" 
                    aria-label={`Supprimer la conversation ${conversation.title}`}
                    title={`Supprimer la conversation ${conversation.title}`}
                    onClick={(e) => handleDelete(conversation.id, e)}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  }, [conversations, loading, error, handleSelect, handleEdit, handleDelete, selectedId, onEdit, onDelete]);

  return (
    <div className="conversation-list">
      {renderContent}
    </div>
  );
});

ConversationList.displayName = 'ConversationList';

export default ConversationList;

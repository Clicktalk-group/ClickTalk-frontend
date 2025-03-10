// /src/components/project/ConversationProjectList/ConversationProjectList.tsx
import React, { useState, useEffect } from 'react';
import { useConversation } from '../../../hooks/useConversation/useConversation';
import { Conversation } from '../../../types/conversation.types';
import './ConversationProjectList.scss';
import { FaTrash, FaComment } from 'react-icons/fa';

interface ConversationProjectListProps {
  projectId: number;
  onSelect: (conversationId: number) => void;
  onRemove: (conversationId: number) => void;
}

const ConversationProjectList: React.FC<ConversationProjectListProps> = ({
  projectId,
  onSelect,
  onRemove
}) => {
  const { fetchProjectConversations, loading } = useConversation();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        if (projectId) {
          const data = await fetchProjectConversations(projectId);
          setConversations(data);
        }
      } catch (error) {
        console.error('Error loading project conversations:', error);
      }
    };

    loadConversations();
  }, [projectId, fetchProjectConversations]);

  if (loading) {
    return <div className="loading">Chargement des conversations...</div>;
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
              onClick={(e) => {
                e.stopPropagation();
                onRemove(conversation.id);
              }}
              title="Retirer de ce projet"
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

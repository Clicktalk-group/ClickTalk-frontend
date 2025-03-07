import React, { useEffect, useState } from "react";
import { useConversation } from "../../../hooks/useConversation/useConversation";
import { Conversation } from "../../../types/conversation.types";
import "./ConversationProjectList.scss";
import { FaTrash } from "react-icons/fa";

interface ConversationProjectListProps {
  projectId: number;
  onSelect: (id: number) => void;
  onRemove: (convId: number) => void;
}

const ConversationProjectList: React.FC<ConversationProjectListProps> = ({ 
  projectId, 
  onSelect, 
  onRemove
}) => {
  const { fetchProjectConversations, loading, error } = useConversation();
  const [projectConversations, setProjectConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const loadConversations = async () => {
      if (!projectId) return;
      
      try {
        const conversations = await fetchProjectConversations(projectId);
        setProjectConversations(conversations || []);
      } catch (error) {
        console.error("Erreur lors du chargement des conversations du projet", error);
      }
    };

    loadConversations();
  }, [projectId, fetchProjectConversations]);

  if (loading) {
    return <div className="loading">Chargement des conversations...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (projectConversations.length === 0) {
    return <div className="empty">Aucune conversation dans ce projet</div>;
  }

  return (
    <div className="conversation-project-list">
      <h3>Conversations du projet</h3>
      <ul>
        {projectConversations.map((conversation) => (
          <li key={conversation.id} onClick={() => onSelect(conversation.id)}>
            <span className="title">{conversation.title}</span>
            <div className="actions">
              <button 
                className="remove-btn" 
                aria-label={`Supprimer la conversation ${conversation.title}`}
                title={`Supprimer la conversation ${conversation.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(conversation.id);
                }}
              >
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationProjectList;

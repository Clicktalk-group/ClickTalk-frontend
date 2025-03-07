// src/pages/Project/Project.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '../../hooks/useProject/useProject';
import { useConversation } from '../../hooks/useConversation/useConversation';
import { Conversation } from '../../types/conversation.types';
import ChatContainer from '../../components/chat/ChatContainer/ChatContainer';
import './Project.scss';
import { FaPlus } from 'react-icons/fa';

interface ConversationProjectListProps {
  projectId: number;
  onSelect: (conversationId: number) => void;
  onRemove: (conversationId: number) => void;
}

// Composant pour afficher les conversations d'un projet
const ConversationProjectList: React.FC<ConversationProjectListProps> = ({ projectId, onSelect, onRemove }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { fetchProjectConversations } = useConversation();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true);
      try {
        const data = await fetchProjectConversations(projectId);
        setConversations(data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des conversations du projet", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (projectId) {
      loadConversations();
    }
  }, [projectId, fetchProjectConversations]);
  
  if (loading) {
    return <div className="loading">Chargement des conversations...</div>;
  }
  
  if (!conversations || conversations.length === 0) {
    return <div className="empty-list">Aucune conversation dans ce projet</div>;
  }
  
  return (
    <ul className="project-conv-list">
      {conversations.map(conv => (
        <li key={conv.id} onClick={() => onSelect(conv.id)}>
          {conv.title}
          <button onClick={(e) => {
            e.stopPropagation();
            onRemove(conv.id);
          }}>❌</button>
        </li>
      ))}
    </ul>
  );
};

const Project: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [isNewConversation, setIsNewConversation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    projects,
    // Les fonctions ci-dessous sont disponibles mais pas utilisées dans ce composant
    // pour l'instant. Nous les gardons prêtes pour de futures fonctionnalités.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fetchProjects
  } = useProject();
  
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  };

  // Sélectionner une conversation existante
  const handleSelectConversation = (conversationId: number) => {
    navigate(`/chat/${conversationId}`);
  };

  // Supprimer une conversation
  const handleRemoveConversation = async (conversationId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette conversation ?")) {
      try {
        await deleteConversation(conversationId);
        // Rafraîchir la liste des conversations
        if (projectId) {
          await fetchProjectConversations(Number(projectId));
        }
      } catch (error) {
        console.error("Erreur lors de la suppression de la conversation:", error);
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
        <h1>{currentProjectData.title}</h1>
        {currentProjectData.context && (
          <p className="project-context">{currentProjectData.context}</p>
        )}
      </div>
      
      <div className="project-content">
        <div className="project-sidebar">
          <button className="new-conv-btn" onClick={handleNewConversation}>
            <FaPlus /> Nouvelle conversation
          </button>
          
          <h3>Conversations du projet</h3>
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
          ) : (
            <div className="select-conversation-msg">
              <p>Sélectionnez une conversation ou créez-en une nouvelle</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Project;

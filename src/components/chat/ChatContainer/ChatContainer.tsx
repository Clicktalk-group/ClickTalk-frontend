import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatInput from '../ChatInput';
import useChat from '../../../hooks/useChat/useChat';
import { useProject } from '../../../hooks/useProject/useProject';
import './ChatContainer.scss';

// Lazy loaded components
const ChatMessages = lazy(() => import('../ChatMessages'));
const InstructionsPreview = lazy(() => import('../../project/InstructionsPreview'));
const PerformanceMonitor = lazy(() => import('../PerformanceMonitor'));

// Loading components
const MessagesLoading = () => (
  <div className="messages-loading">
    <div className="spinner"></div>
    <p>Chargement des messages...</p>
  </div>
);

interface ChatContainerProps {
  onMessageSent?: () => void;
  projectId?: number;
  conversationId?: number;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ onMessageSent, projectId, conversationId }) => {
  // Récupérer l'ID de conversation de l'URL si disponible
  const { conversationId: urlConversationId } = useParams<{ conversationId?: string }>();
  // Priorité à la prop, puis au paramètre d'URL
  const convId = conversationId ? conversationId : urlConversationId ? parseInt(urlConversationId, 10) : undefined;
  const navigate = useNavigate();
  
  const [isNewConversation, setIsNewConversation] = useState(!convId);
  const [showPerformanceMetrics, setShowPerformanceMetrics] = useState(false);
  
  const { 
    messages, 
    isLoading, 
    error,
    sendMessage, 
    copyMessage,
    currentConversation,
    streamingMessage,
    performanceMetrics
  } = useChat(convId);

  // Utiliser le hook useProject pour récupérer les détails du projet si projectId est défini
  const { fetchProjects } = useProject();
  const [projectInstructions, setProjectInstructions] = useState<string | undefined>(undefined);

  // Charger les instructions du projet si projectId est fourni
  useEffect(() => {
    if (projectId) {
      const loadProjectInstructions = async () => {
        try {
          const projects = await fetchProjects();
          const project = projects.find(p => p.id === projectId);
          
          if (project && project.context) {
            setProjectInstructions(project.context);
          } else {
            setProjectInstructions(undefined);
          }
        } catch (err) {
          console.error("Erreur lors du chargement des instructions du projet:", err);
          setProjectInstructions(undefined);
        }
      };
      
      loadProjectInstructions();
    } else {
      setProjectInstructions(undefined);
    }
  }, [projectId, fetchProjects]);

  // Si la conversation est créée, naviguer vers son URL
  useEffect(() => {
    if (isNewConversation && currentConversation?.id) {
      setIsNewConversation(false);
      if (!projectId) {
        navigate(`/chat/${currentConversation.id}`);
      }
    }
  }, [currentConversation, isNewConversation, navigate, projectId]);

  const handleTogglePerformanceMetrics = useCallback(() => {
    setShowPerformanceMetrics(prev => !prev);
  }, []);

  // Fonction pour envoyer un message
  const handleSendMessage = useCallback(async (content: string) => {
    if (isNewConversation) {
      try {
        sendMessage(undefined, content, projectId);
        
        if (onMessageSent) {
          onMessageSent();
        }
      } catch (error) {
        console.error("Erreur lors de la création de la conversation:", error);
      }
    } else {
      sendMessage(convId, content, projectId);
      
      if (onMessageSent) {
        onMessageSent();
      }
    }
  }, [isNewConversation, sendMessage, convId, onMessageSent, projectId]);

  return (
    <div className="chat-container">
      <div className="chat-tools">
        <button 
          onClick={handleTogglePerformanceMetrics}
          className="performance-toggle-btn"
        >
          {showPerformanceMetrics ? 'Hide Performance Metrics' : 'Show Performance Metrics'}
        </button>
      </div>
      
      {/* Utiliser le composant PerformanceMonitor uniquement si visible */}
      {showPerformanceMetrics && (
        <Suspense fallback={<div>Chargement des métriques...</div>}>
          <PerformanceMonitor 
            metrics={performanceMetrics} 
            visible={true}
          />
        </Suspense>
      )}
      
      {/* Afficher les instructions du projet si disponibles */}
      {projectInstructions && (
        <Suspense fallback={<div>Chargement des instructions...</div>}>
          <InstructionsPreview instructions={projectInstructions} />
        </Suspense>
      )}
      
      <Suspense fallback={<MessagesLoading />}>
        <ChatMessages 
          messages={messages} 
          isLoading={isLoading} 
          onCopyMessage={copyMessage} 
          streamingMessage={streamingMessage}
        />
      </Suspense>
      
      <ChatInput 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
      
      {error && <div className="chat-error">{error}</div>}
    </div>
  );
};

export default React.memo(ChatContainer);

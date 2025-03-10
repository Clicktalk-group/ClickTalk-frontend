// src/components/chat/ChatContainer/ChatContainer.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatMessages from '../ChatMessages';
import ChatInput from '../ChatInput';
import useChat from '../../../hooks/useChat/useChat';
import PerformanceMonitor from '../PerformanceMonitor';
import './ChatContainer.scss';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useConversation } from '../../../hooks/useConversation/useConversation';

interface ChatContainerProps {
  onMessageSent?: () => void;
  projectId?: number;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ onMessageSent, projectId }) => {
  // Récupérer l'ID de conversation de l'URL si disponible
  const { conversationId } = useParams<{ conversationId?: string }>();
  const convId = conversationId ? parseInt(conversationId, 10) : undefined;
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
    performanceMetrics // Nouvelle propriété pour les métriques
  } = useChat(convId);

  // Si la conversation est créée, naviguer vers son URL
  useEffect(() => {
    if (isNewConversation && currentConversation?.id) {
      setIsNewConversation(false);
      navigate(`/chat/${currentConversation.id}`);
    }
  }, [currentConversation, isNewConversation, navigate]);

  // Utiliser useCallback pour éviter de recréer cette fonction à chaque rendu
  const handleTogglePerformanceMetrics = useCallback(() => {
    setShowPerformanceMetrics(prev => !prev);
  }, []);

  // Fonction pour envoyer un message
  const handleSendMessage = useCallback(async (content: string) => {
    // Pour une nouvelle conversation, créer d'abord la conversation visuellement
    if (isNewConversation) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const messageTitle = content.length > 30 
          ? content.substring(0, 30) + "..." 
          : content;

        // Envoyer le message qui créera automatiquement la conversation
        sendMessage(undefined, content);
        
        // Notifier le parent que nous sommes en mode chat
        if (onMessageSent) {
          onMessageSent();
        }
      } catch (error) {
        console.error("Erreur lors de la création de la conversation:", error);
      }
    } else {
      // Conversation existante, envoyer simplement le message
      sendMessage(convId, content);
      
      // Notifier le parent que nous sommes en mode chat
      if (onMessageSent) {
        onMessageSent();
      }
    }
  }, [isNewConversation, sendMessage, convId, onMessageSent]);

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
        <PerformanceMonitor 
          metrics={performanceMetrics} 
          visible={true}
        />
      )}
      
      <ChatMessages 
        messages={messages} 
        isLoading={isLoading} 
        onCopyMessage={copyMessage} 
        streamingMessage={streamingMessage}
      />
      
      <ChatInput 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
      
      {error && <div className="chat-error">{error}</div>}
    </div>
  );
};

export default ChatContainer;

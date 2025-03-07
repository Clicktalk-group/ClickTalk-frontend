// src/components/chat/ChatContainer/ChatContainer.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatMessages from '../ChatMessages';
import ChatInput from '../ChatInput';
import useChat from '../../../hooks/useChat/useChat';
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
  
  const { 
    messages, 
    isLoading, 
    error,
    sendMessage, 
    copyMessage,
    currentConversation
  } = useChat(convId);

  // Si la conversation est créée, naviguer vers son URL
  useEffect(() => {
    if (isNewConversation && currentConversation?.id) {
      setIsNewConversation(false);
      navigate(`/chat/${currentConversation.id}`);
    }
  }, [currentConversation, isNewConversation, navigate]);

  // Fonction pour envoyer un message
  const handleSendMessage = async (content: string) => {
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
  };

  return (
    <div className="chat-container">
      <ChatMessages 
        messages={messages} 
        isLoading={isLoading} 
        onCopyMessage={copyMessage} 
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

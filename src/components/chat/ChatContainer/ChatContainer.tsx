import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatMessages from "../ChatMessages";
import ChatInput from "../ChatInput";
import useChat from "../../../hooks/useChat/useChat";
import "./ChatContainer.scss";

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
  
  const { 
    messages, 
    isLoading, 
    error,
    sendMessage, 
    copyMessage,
    currentConversationId,
    streamingMessage
  } = useChat(convId);

  // Si la conversation est créée, naviguer vers son URL
  useEffect(() => {
    if (isNewConversation && currentConversationId) {
      setIsNewConversation(false);
      if (!projectId) { // Ne naviguer que s'il ne s'agit pas d'un chat dans un projet
        navigate(`/chat/${currentConversationId}`);
      }
    }
  }, [currentConversationId, isNewConversation, navigate, projectId]);

  // Fonction pour envoyer un message
  const handleSendMessage = useCallback(async (content: string) => {
    // Pour une nouvelle conversation, créer d'abord la conversation visuellement
    if (isNewConversation) {
      try {
        // Envoyer le message qui créera automatiquement la conversation
        sendMessage(undefined, content, projectId);
        
        // Notifier le parent que nous sommes en mode chat
        if (onMessageSent) {
          onMessageSent();
        }
      } catch (error) {
        console.error("Erreur lors de la création de la conversation:", error);
      }
    } else {
      // Conversation existante, envoyer simplement le message
      sendMessage(convId, content, projectId);
      
      // Notifier le parent que nous sommes en mode chat
      if (onMessageSent) {
        onMessageSent();
      }
    }
  }, [isNewConversation, sendMessage, convId, onMessageSent, projectId]);

  return (
    <div className="chat-container">
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

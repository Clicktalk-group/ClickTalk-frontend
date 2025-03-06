// src/components/chat/ChatContainer/ChatContainer.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import ChatMessages from '../ChatMessages';
import ChatInput from '../ChatInput';
import useChat from '../../../hooks/useChat/useChat';
import './ChatContainer.scss';

interface ChatContainerProps {
  onMessageSent?: () => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ onMessageSent }) => {
  // Récupérer l'ID de conversation de l'URL si disponible
  const { conversationId } = useParams<{ conversationId?: string }>();
  const convId = conversationId ? parseInt(conversationId, 10) : 0;
  
  const { 
    messages, 
    isLoading, 
    error,
    sendMessage, 
    copyMessage 
  } = useChat(convId || undefined);

  // Fonction pour envoyer un message et notifier le parent
  const handleSendMessage = (content: string) => {
    sendMessage(convId, content);
    // Activer le mode chat uniquement après l'envoi d'un message
    if (onMessageSent) {
      onMessageSent();
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
        // Suppression de onFocus car nous ne voulons pas activer le mode au clic
      />
      
      {error && <div className="chat-error">{error}</div>}
    </div>
  );
};

export default ChatContainer;

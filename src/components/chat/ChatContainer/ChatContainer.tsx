// src/components/chat/ChatContainer/ChatContainer.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import ChatMessages from '../ChatMessages';
import ChatInput from '../ChatInput';
import useChat from '../../../hooks/useChat/useChat';
import './ChatContainer.scss';

const ChatContainer: React.FC = () => {
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

  return (
    <div className="chat-container">

      <ChatMessages 
        messages={messages} 
        isLoading={isLoading} 
        onCopyMessage={copyMessage} 
      />
      
      <ChatInput 
        onSendMessage={(content: string) => sendMessage(convId, content)}
        isLoading={isLoading}
      />
      
      {error && <div className="chat-error">{error}</div>}
    </div>
  );
};

export default ChatContainer;

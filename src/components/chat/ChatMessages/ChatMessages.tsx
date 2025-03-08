import React, { useRef, useEffect } from 'react';
import { Message } from '../../../types/chat.types';
import MessageBubble from '../MessageBubble';
import LoadingIndicator from '../LoadingIndicator';
import './ChatMessages.scss';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  onCopyMessage: (content: string) => void;
  streamingMessage: string | null; // NOUVEAU: pour afficher le message en streaming
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ 
  messages, 
  isLoading, 
  onCopyMessage,
  streamingMessage 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages come in
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamingMessage]); 

  useEffect(() => {
    console.log(`Rendering ${messages.length} messages`);
    if (streamingMessage) {
      console.log(`Current streaming message: ${streamingMessage.substring(0, 30)}...`);
    }
  }, [messages, streamingMessage]);

  // Trouver le dernier message bot temporaire sans utiliser findLast
  let lastBotMessage: Message | undefined = undefined;
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.isBot && typeof msg.id === 'string' && msg.id.includes('temp-bot')) {
      lastBotMessage = msg;
      break;
    }
  }

  return (
    <div className="chat-messages" ref={messagesContainerRef}>
      {messages.length === 0 && !isLoading ? (
        <div className="empty-state">
          <p>Commencez une conversation!</p>
        </div>
      ) : (
        <>
          {/* Afficher les messages dans l'ordre chronologique */}
          {messages.map((message, index) => {
            // Détermine si ce message spécifique est en streaming
            const isStreaming = message === lastBotMessage && streamingMessage !== null;
            
            // Contenu à afficher (original ou streaming si applicable)
            const displayContent = isStreaming ? streamingMessage : message.content;
            
            return (
              <MessageBubble 
                key={typeof message.id === 'string' ? message.id : `msg-${index}`}
                message={{...message, content: displayContent}}
                onCopy={() => onCopyMessage(displayContent)}
                isStreaming={isStreaming}
              />
            );
          })}
          
          {/* Indicateur de chargement (seulement si aucun message en streaming) */}
          {isLoading && !streamingMessage && !lastBotMessage && (
            <div className="loading-message">
              <LoadingIndicator />
              <p>ClickTalk est en train d'écrire...</p>
            </div>
          )}
        </>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;

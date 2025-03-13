import React, { useRef, useEffect, useCallback, memo, useMemo } from 'react';
import { Message } from '../../../types/chat.types';
import MessageBubble from '../MessageBubble';
import LoadingIndicator from '../LoadingIndicator';
import './ChatMessages.scss';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  onCopyMessage: (content: string) => void;
  streamingMessage: string | null;
}

const ChatMessages: React.FC<ChatMessagesProps> = memo(({ 
  messages, 
  isLoading, 
  onCopyMessage,
  streamingMessage 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Optimisation: utiliser useCallback pour éviter les recréations de fonctions
  const copyMessageCallback = useCallback((content: string) => {
    onCopyMessage(content);
  }, [onCopyMessage]);

  // Auto-scroll to bottom when new messages come in
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamingMessage]); 

  // Developpement logs uniquement en environnement de développement
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Rendering ${messages.length} messages`);
      if (streamingMessage) {
        console.log(`Current streaming message: ${streamingMessage.substring(0, 30)}...`);
      }
    }
  }, [messages, streamingMessage]);

  // Trouver le dernier message bot temporaire de manière optimisée
  const lastBotMessage = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.isBot && typeof msg.id === 'string' && msg.id.includes('temp-bot')) {
        return msg;
      }
    }
    return undefined;
  }, [messages]);

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
                onCopy={() => copyMessageCallback(displayContent)}
                isStreaming={isStreaming}
              />
            );
          })}
          
          {/* Indicateur de chargement (modifié pour s'afficher correctement) */}
          {isLoading && !streamingMessage && (
            <div className="loading-message">
              <LoadingIndicator />
              <p>{lastBotMessage ? "ClickTalk est entraind'écrire..." : "ClickTalk est en train d'écrire..."}</p>
            </div>
          )}
        </>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
});

export default ChatMessages;

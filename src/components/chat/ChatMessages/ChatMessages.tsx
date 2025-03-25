// ChatMessages.tsx
import React, { useRef, useEffect, useCallback, memo, useMemo } from 'react';
import { Message } from '../../../types/chat.types';
import MessageBubble from '../MessageBubble';
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
  }, [messages, streamingMessage, isLoading]); 

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

  // Préparer les messages à afficher
  const displayMessages = useMemo(() => {
    // Si aucun message et chargement, créer un message temporaire pour l'indicateur
    if (messages.length === 0 && isLoading) {
      return [{
        id: 'typing-indicator',
        convId: -1,
        content: '',
        isBot: true,
        createdAt: new Date().toISOString(),
      }];
    }
    return messages;
  }, [messages, isLoading]);

  return (
    <div className="chat-messages" ref={messagesContainerRef}>
      {displayMessages.length === 0 ? (
        <div className="empty-state">
          <p>Commencez une conversation!</p>
        </div>
      ) : (
        <>
          {displayMessages.map((message, index) => {
            // Un message est en train d'être streamé s'il est le dernier message bot et que streamingMessage existe
            const isStreaming = message === lastBotMessage && streamingMessage !== null;
            
            // Message est en chargement s'il est le dernier message bot, n'a pas de contenu et est en chargement
            const isTyping = message.isBot && 
                            message.content === '' && 
                            isLoading && 
                            streamingMessage === null && 
                            (index === displayMessages.length - 1);
            
            // Contenu à afficher
            let displayContent = message.content;
            if (isStreaming) {
              displayContent = streamingMessage;
            }
            
            return (
              <MessageBubble 
                key={typeof message.id === 'string' ? message.id : `msg-${index}`}
                message={{...message, content: displayContent}}
                onCopy={() => copyMessageCallback(displayContent)}
                isStreaming={isStreaming}
                isTyping={isTyping}
              />
            );
          })}
        </>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
});

export default ChatMessages;

import React, { useRef, useEffect } from 'react';
import { Message } from '../../../types/chat.types';
import MessageBubble from '../MessageBubble';
import LoadingIndicator from '../LoadingIndicator';
import './ChatMessages.scss';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  onCopyMessage: (content: string) => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ 
  messages, 
  isLoading, 
  onCopyMessage 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages come in
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Ajouter des logs pour déboguer
  useEffect(() => {
    console.log(`Rendering ${messages.length} messages`);
    messages.forEach((msg, i) => {
      console.log(`Message ${i}: ID=${msg.id}, isBot=${msg.isBot}, content=${msg.content.substring(0, 30)}...`);
    });
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
          {messages
            .filter(message => typeof message.id !== 'string' || !message.id.includes('temp-bot'))
            .map((message, index) => (
              <MessageBubble 
                key={`${message.id}-${index}`} 
                message={message}
                onCopy={() => onCopyMessage(message.content)} 
              />
            ))}
          
          {isLoading && (
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

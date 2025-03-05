// src/components/chat/ChatMessages/ChatMessages.tsx
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

  // Auto-scroll to bottom when new messages come in
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-messages">
      {messages.map((message) => (
        <MessageBubble 
          key={message.id} 
          message={message}
          onCopy={() => onCopyMessage(message.content)} 
        />
      ))}
      
      {isLoading && (
        <div className="loading-message">
          <LoadingIndicator />
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;

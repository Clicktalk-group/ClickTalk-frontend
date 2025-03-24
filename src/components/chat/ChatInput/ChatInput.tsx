import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import './ChatInput.scss';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  onFocus?: () => void;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  onFocus,
  placeholder = "Type a message..."
}) => {
  const [message, setMessage] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const isMessageEmpty = !message.trim();

  // Resize textarea height based on content - optimisé avec requestAnimationFrame
  useEffect(() => {
    if (!textAreaRef.current) return;
    
    requestAnimationFrame(() => {
      if (textAreaRef.current) {
        textAreaRef.current.style.height = 'auto';
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
      }
    });
  }, [message]);

  // Optimisé avec useCallback pour éviter les re-rendus inutiles
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isMessageEmpty && !isLoading) {
      onSendMessage(message);
      setMessage('');
      
      // Reset textarea height
      requestAnimationFrame(() => {
        if (textAreaRef.current) {
          textAreaRef.current.style.height = 'auto';
        }
      });
    }
  }, [message, isMessageEmpty, isLoading, onSendMessage]);

  // Optimisé avec useCallback
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Envoi du message avec Enter sans shift
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  }, [handleSubmit]);

  // Gestion du focus avec callback
  const handleFocus = useCallback(() => {
    onFocus?.();
  }, [onFocus]);
  
  return (
    <div className="chat-input-container">
      <form onSubmit={handleSubmit} className="message-form">
        <textarea
          ref={textAreaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          rows={1}
          disabled={isLoading}
          className={`message-textarea ${isLoading ? 'loading' : ''}`}
          aria-label="Message input"
        />
        <button 
          type="submit" 
          className={`send-button ${(isMessageEmpty || isLoading) ? 'disabled' : ''}`}
          disabled={isMessageEmpty || isLoading}
          title="Send message"
          aria-label="Send message"
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

// Export avec mémoïsation pour éviter les re-rendus inutiles
export default memo(ChatInput);

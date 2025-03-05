// src/components/chat/ChatInput/ChatInput.tsx
import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa'; // Remplaçant FiSend qui n'est pas reconnu
import './ChatInput.scss';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Resize textarea height based on content
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="chat-input-container" onSubmit={handleSubmit}>
      <textarea
        ref={textAreaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        rows={1}
        disabled={isLoading}
      />
      <button 
        type="submit" 
        className={`send-button ${(!message.trim() || isLoading) ? 'disabled' : ''}`}
        disabled={!message.trim() || isLoading}
        title="Send message"
      >
        <FaPaperPlane />
      </button>
    </form>
  );
};

export default ChatInput;
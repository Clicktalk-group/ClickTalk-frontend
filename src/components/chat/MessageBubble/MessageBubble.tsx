// src/components/chat/MessageBubble/MessageBubble.tsx
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../../../types/chat.types';
import { FaCopy, FaCheck } from 'react-icons/fa'; // Remplaçant FiCopy et FiCheck qui ne sont pas reconnus
import './MessageBubble.scss';

interface MessageBubbleProps {
  message: Message;
  onCopy: () => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };

  const formattedDate = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={`message-bubble ${message.isBot ? 'bot' : 'user'}`}>
      <div className="message-content">
        {message.isBot ? (
          <>
            <ReactMarkdown>{message.content}</ReactMarkdown>
            <button className="copy-button" onClick={handleCopy} aria-label="Copy message">
              {copied ? <FaCheck /> : <FaCopy />}
            </button>
          </>
        ) : (
          <p>{message.content}</p>
        )}
      </div>
      <div className="message-timestamp">{formattedDate}</div>
    </div>
  );
};

export default MessageBubble;

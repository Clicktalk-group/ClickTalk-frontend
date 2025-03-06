import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { Message } from '../../../types/chat.types';
import { FaCopy, FaCheck, FaUser, FaRobot } from 'react-icons/fa'; 
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
      <div className="message-header">
        <div className="avatar">
          {message.isBot ? <FaRobot /> : <FaUser />}
        </div>
        <span className="sender">{message.isBot ? 'ClickTalk' : 'Vous'}</span>
        <span className="time">{formattedDate}</span>
      </div>

      <div className="message-content">
        {message.isBot ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {message.content}
          </ReactMarkdown>
        ) : (
          <p>{message.content}</p>
        )}
      </div>

      {message.isBot && (
        <div className="message-actions">
          <button 
            className="copy-button" 
            onClick={handleCopy} 
            aria-label="Copy message"
          >
            {copied ? <FaCheck /> : <FaCopy />}
            <span>{copied ? 'Copié' : 'Copier'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;

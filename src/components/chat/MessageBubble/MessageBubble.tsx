import React, { memo } from 'react';
import { FaCopy } from 'react-icons/fa';
import { Message } from '../../../types/chat.types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import './MessageBubble.scss';

interface MessageBubbleProps {
  message: Message;
  onCopy: () => void;
  isStreaming?: boolean;
}

// Utilisation de React.memo pour éviter les rendus inutiles
const MessageBubble: React.FC<MessageBubbleProps> = memo(({ message, onCopy, isStreaming = false }) => {
  const { content, isBot } = message;
  
  // Sécurité supplémentaire pour s'assurer que le contenu est une chaîne de caractères
  const safeContent = typeof content === 'string' ? content : '';
  
  return (
    <div className={`message-bubble ${isBot ? 'bot' : 'user'} ${isStreaming ? 'streaming' : ''}`}>
      <div className="message-content">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]} 
          rehypePlugins={[rehypeHighlight]}
        >
          {safeContent}
        </ReactMarkdown>
        {isStreaming && (
          <span className="cursor-blink">|</span>
        )}
      </div>
      
      {isBot && safeContent.trim().length > 0 && (
        <div className="message-actions">
          <button className="copy-button" onClick={onCopy} aria-label="Copy message">
            <FaCopy />
            <span>Copier</span>
          </button>
        </div>
      )}
    </div>
  );
});

export default MessageBubble;

// MessageBubble.tsx
import React, { memo } from 'react';
import { FaCopy } from 'react-icons/fa';
import { Message } from '../../../types/chat.types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import './MessageBubble.scss';
import LoadingIndicator from '../LoadingIndicator';

interface MessageBubbleProps {
  message: Message;
  onCopy: () => void;
  isStreaming?: boolean;
  isTyping?: boolean;
}

// Utilisation de React.memo pour éviter les rendus inutiles
const MessageBubble: React.FC<MessageBubbleProps> = memo(({ 
  message, 
  onCopy, 
  isStreaming = false, 
  isTyping = false 
}) => {
  const { content, isBot } = message;
  
  // Sécurité supplémentaire pour s'assurer que le contenu est une chaîne de caractères
  const safeContent = typeof content === 'string' ? content : '';
  
  return (
    <div className={`message-bubble ${isBot ? 'bot' : 'user'} ${isStreaming ? 'streaming' : ''} ${isTyping ? 'typing' : ''}`}>
      <div className="message-content">
        {isTyping ? (
          <div className="typing-indicator">
            <LoadingIndicator />
            <p>ClickTalk est en train d'écrire...</p>
          </div>
        ) : (
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            rehypePlugins={[rehypeHighlight]}
          >
            {safeContent}
          </ReactMarkdown>
        )}
      </div>
      
      {isBot && !isTyping && safeContent.trim().length > 0 && (
        <div className="message-actions-outside">
          <button className="copy-button" onClick={onCopy} aria-label="Copier le message">
            <FaCopy />
          </button>
        </div>
      )}
    </div>
  );
});

export default MessageBubble;

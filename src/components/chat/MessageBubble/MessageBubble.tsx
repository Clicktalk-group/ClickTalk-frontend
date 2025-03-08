import React from 'react';
import { FaCopy } from 'react-icons/fa';
import { Message } from '../../../types/chat.types';
import './MessageBubble.scss';

interface MessageBubbleProps {
  message: Message;
  onCopy: () => void;
  isStreaming?: boolean; // NOUVEAU: Pour indiquer si le message est en train de streamer
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onCopy, isStreaming = false }) => {
  const { content, isBot } = message;
  
  // Sécurité supplémentaire pour s'assurer que le contenu est une chaîne de caractères
  const safeContent = typeof content === 'string' ? content : '';
  
  // Formatage du contenu pour l'affichage (conservation des sauts de ligne)
  const formattedContent = safeContent.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < safeContent.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));

  return (
    <div className={`message-bubble ${isBot ? 'bot' : 'user'} ${isStreaming ? 'streaming' : ''}`}>
      <div className="message-content">
        {formattedContent}
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
};

export default MessageBubble;

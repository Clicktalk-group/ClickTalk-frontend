import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaBold, FaItalic, FaCode, FaListUl, FaListOl, FaLink } from 'react-icons/fa';
import './ChatInput.scss';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  onFocus?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, onFocus }) => {
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
      
      // Reset textarea height
      if (textAreaRef.current) {
        textAreaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Gestion du focus sur la zone de texte
  const handleFocus = () => {
    if (onFocus) {
      onFocus();
    }
  };

  // Insérer du formatage pour le texte sélectionné
  const insertFormatting = (startTag: string, endTag: string = '') => {
    if (!textAreaRef.current) return;

    const textarea = textAreaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = message.substring(start, end);
    
    const newText = message.substring(0, start) + 
                    startTag + selectedText + endTag + 
                    message.substring(end);
    
    setMessage(newText);

    // Remettre le focus et la sélection
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + startTag.length;
      textarea.selectionEnd = start + startTag.length + selectedText.length;
    }, 0);
  };

  return (
    <div className="chat-input-container">
      <div className="formatting-toolbar">
        <button 
          type="button" 
          title="Bold" 
          onClick={() => insertFormatting('**', '**')} 
          disabled={isLoading}
        >
          <FaBold />
        </button>
        <button 
          type="button" 
          title="Italic" 
          onClick={() => insertFormatting('*', '*')} 
          disabled={isLoading}
        >
          <FaItalic />
        </button>
        <button 
          type="button" 
          title="Code" 
          onClick={() => insertFormatting('`', '`')} 
          disabled={isLoading}
        >
          <FaCode />
        </button>
        <button 
          type="button" 
          title="Bulleted List" 
          onClick={() => insertFormatting('\n- ', '')} 
          disabled={isLoading}
        >
          <FaListUl />
        </button>
        <button 
          type="button" 
          title="Numbered List" 
          onClick={() => insertFormatting('\n1. ', '')} 
          disabled={isLoading}
        >
          <FaListOl />
        </button>
        <button 
          type="button" 
          title="Insert Link" 
          onClick={() => {
            const url = prompt('Enter URL:') || '';
            const text = message.substring(
              textAreaRef.current?.selectionStart || 0, 
              textAreaRef.current?.selectionEnd || 0
            ) || 'link text';
            
            insertFormatting(`[${text}](`, `${url})`);
          }} 
          disabled={isLoading}
        >
          <FaLink />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="message-form">
        <textarea
          ref={textAreaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder="Type a message..."
          rows={1}
          disabled={isLoading}
          className="message-textarea"
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
    </div>
  );
};

export default ChatInput;

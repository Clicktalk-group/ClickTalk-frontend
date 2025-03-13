import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { FaPaperPlane, FaBold, FaItalic, FaCode, FaListUl, FaListOl, FaLink } from 'react-icons/fa';
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
    
    // Support des tabulations dans le texte
    if (e.key === 'Tab') {
      e.preventDefault();
      
      const textarea = textAreaRef.current;
      if (!textarea) return;
      
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      // Insérer une tabulation (2 espaces pour rester propre)
      const newText = message.substring(0, start) + '  ' + message.substring(end);
      setMessage(newText);
      
      // Replacer le curseur après la tabulation
      requestAnimationFrame(() => {
        if (textarea) {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        }
      });
    }
  }, [message, handleSubmit]);

  // Gestion du focus avec callback
  const handleFocus = useCallback(() => {
    onFocus?.();
  }, [onFocus]);

  // Insérer du formatage pour le texte sélectionné - optimisé avec useCallback
  const insertFormatting = useCallback((startTag: string, endTag: string = '') => {
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
    requestAnimationFrame(() => {
      if (textarea) {
        textarea.focus();
        textarea.selectionStart = start + startTag.length;
        textarea.selectionEnd = start + startTag.length + selectedText.length;
      }
    });
  }, [message]);

  // Créer un lien avec prompt - optimisé avec useCallback
  const insertLink = useCallback(() => {
    if (!textAreaRef.current) return;
    
    const textarea = textAreaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = message.substring(start, end) || 'link text';
    
    // Utiliser une valeur par défaut plus utile pour l'URL
    const url = prompt('Enter URL:', 'https://') || 'https://';
    
    // Insérer le markdown pour le lien
    insertFormatting(`[${selectedText}](`, `${url})`);
  }, [message, insertFormatting]);

  // Mémoisation des boutons de formatage pour des performances optimales
  const FormattingButton = memo(({
    title,
    onClick,
    icon
  }: {
    title: string;
    onClick: () => void;
    icon: React.ReactNode;
  }) => (
    <button 
      type="button" 
      title={title} 
      onClick={onClick} 
      disabled={isLoading}
      className="formatting-button"
    >
      {icon}
    </button>
  ));
  
  return (
    <div className="chat-input-container">
      <div className="formatting-toolbar">
        <FormattingButton 
          title="Bold" 
          onClick={() => insertFormatting('**', '**')} 
          icon={<FaBold />} 
        />
        <FormattingButton 
          title="Italic" 
          onClick={() => insertFormatting('*', '*')} 
          icon={<FaItalic />} 
        />
        <FormattingButton 
          title="Code" 
          onClick={() => insertFormatting('`', '`')} 
          icon={<FaCode />} 
        />
        <FormattingButton 
          title="Bulleted List" 
          onClick={() => insertFormatting('\n- ', '')} 
          icon={<FaListUl />} 
        />
        <FormattingButton 
          title="Numbered List" 
          onClick={() => insertFormatting('\n1. ', '')} 
          icon={<FaListOl />} 
        />
        <FormattingButton 
          title="Insert Link" 
          onClick={insertLink} 
          icon={<FaLink />} 
        />
      </div>
      
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

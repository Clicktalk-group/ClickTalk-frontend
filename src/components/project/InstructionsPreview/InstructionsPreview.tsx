import React from 'react';
import { FaClipboardList } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import './InstructionsPreview.scss';

interface InstructionsPreviewProps {
  instructions?: string;
  title?: string;
}

const InstructionsPreview: React.FC<InstructionsPreviewProps> = ({ 
  instructions,
  title = 'Instructions du projet'
}) => {
  // Si pas d'instructions, ne pas afficher le composant
  if (!instructions) {
    return null;
  }

  return (
    <div className={`instructions-preview ${!instructions ? 'instructions-preview--empty' : ''}`}>
      <div className="instructions-preview__header">
        <FaClipboardList />
        <h3>{title}</h3>
      </div>
      <div className="instructions-preview__content">
        <ReactMarkdown>{instructions}</ReactMarkdown>
      </div>
    </div>
  );
};

export default InstructionsPreview;

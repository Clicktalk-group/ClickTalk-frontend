import React from 'react';
import { FaTimes } from 'react-icons/fa';
import './ProjectContextPopup.scss';

interface ProjectContextPopupProps {
  isOpen: boolean;
  onClose: () => void;
  context: string;
  title: string;
}

export const ProjectContextPopup: React.FC<ProjectContextPopupProps> = ({
  isOpen,
  onClose,
  context,
  title
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="project-context-popup">
      <div className="context-popup-backdrop" onClick={onClose}></div>
      <div className="context-popup-content">
        <div className="context-popup-header">
          <h3>Contexte Projet</h3>
          <button className="context-popup-close" onClick={onClose} title="Close">
            <FaTimes />
          </button>
        </div>
        <div className="context-popup-body">
          <h4>{title}</h4>
          <p>{context}</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectContextPopup;

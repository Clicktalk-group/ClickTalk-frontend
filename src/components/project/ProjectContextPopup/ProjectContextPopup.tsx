import React, { memo, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import './ProjectContextPopup.scss';

interface ProjectContextPopupProps {
  isOpen: boolean;
  onClose: () => void;
  context: string;
  title: string;
}

// Utilisation de memo pour éviter les re-rendus inutiles
export const ProjectContextPopup: React.FC<ProjectContextPopupProps> = memo(({
  isOpen,
  onClose,
  context,
  title
}) => {
  // Référence pour piéger le focus dans le popup
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  
  // Gérer l'échappement avec la touche Escape
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Focus sur le bouton de fermeture quand le popup s'ouvre
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
    
    // Empêcher le défilement du corps quand le popup est ouvert
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);
  
  // Si le popup n'est pas ouvert, ne rien rendre du tout pour économiser des ressources
  if (!isOpen) return null;
  
  // Optimisation du contexte pour éviter les problèmes de performance
  const displayContext = context?.length > 5000 
    ? context.substring(0, 5000) + '...' 
    : context || 'Aucun contexte disponible';
  
  return (
    <div 
      className="project-context-popup" 
      role="dialog" 
      aria-labelledby="context-title"
      aria-modal="true"
    >
      <div 
        className="context-popup-backdrop" 
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div className="context-popup-content">
        <div className="context-popup-header">
          <h3 id="context-title">Contexte Projet</h3>
          <button 
            className="context-popup-close" 
            onClick={onClose} 
            title="Fermer"
            aria-label="Fermer le popup de contexte"
            ref={closeButtonRef}
          >
            <FaTimes aria-hidden="true" />
          </button>
        </div>
        <div className="context-popup-body">
          <h4>{title}</h4>
          <p>{displayContext}</p>
        </div>
      </div>
    </div>
  );
});

// Ajouter displayName pour les DevTools React
ProjectContextPopup.displayName = 'ProjectContextPopup';

export default ProjectContextPopup;

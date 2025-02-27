import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { ModalProps } from './Modal.types';
import './Modal.scss';

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Gestion de la fermeture avec la touche Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onClose) onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Gestion de la fermeture en cliquant hors du modal
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && onClose) {
      onClose();
    }
  };

  // Si le modal n'est pas ouvert, ne retourne rien
  if (!isOpen) return null;

  const modalClasses = classNames('modal-content', size, className);

  return createPortal(
    <div
      className="modal active"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className={modalClasses}
        ref={modalRef}
        role="document"
        data-testid="modal-content"
      >
        <div className="modal-header">
          {title && (
            <h2 className="modal-title" id="modal-title">
              {title}
            </h2>
          )}
          <button
            className="close-modal"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
};

Modal.displayName = 'Modal';

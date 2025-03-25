import React, { useMemo, useCallback, memo } from 'react';
import { CardProps } from './Card.types';
import './Card.scss';

export const Card: React.FC<CardProps> = memo(({
  title,
  subtitle,
  children,
  footer,
  className = '',
  onClick,
  hover = false,
  icon,
}) => {
  // Mémoïsation de la classe
  const cardClasses = useMemo(() => 
    `card ${hover ? 'card--hover' : ''} ${className}`.trim()
  , [hover, className]);

  // Mémoïsation du gestionnaire d'événement
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) onClick(e);
  }, [onClick]);

  // Préparation des attributs d'accessibilité
  const interactionProps = useMemo(() => 
    onClick ? { 
      role: 'button', 
      tabIndex: 0,
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick && onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
        }
      }
    } : {}
  , [onClick]);

  // Conditionnellement rendre les sections seulement si elles ont du contenu
  const hasHeader = Boolean(title || icon || subtitle);
  
  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      {...interactionProps}
      aria-label={title || 'Card'}
    >
      {/* Header Section - Rendu conditionnel */}
      {hasHeader && (
        <div className="card__header">
          {icon && <div className="card__icon">{icon}</div>}
          <div className="card__titles">
            {title && <h3 className="card__title">{title}</h3>}
            {subtitle && <p className="card__subtitle">{subtitle}</p>}
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="card__content">{children}</div>

      {/* Footer Section - Rendu conditionnel */}
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
});

Card.displayName = 'Card';

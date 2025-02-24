import React from 'react';
import { CardProps } from './Card.types';
import './Card.scss';

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  className = '',
  onClick,
  hover = false,
  icon
}) => {
  const cardClasses = `card ${hover ? 'card--hover' : ''} ${className}`;

  return (
    <div 
      className={cardClasses}
      onClick={onClick}
      {...(onClick && { role: 'button', tabIndex: 0 })}
    >
      {(title || icon || subtitle) && (
        <div className="card__header">
          {icon && <div className="card__icon">{icon}</div>}
          <div className="card__titles">
            {title && <h3 className="card__title">{title}</h3>}
            {subtitle && <p className="card__subtitle">{subtitle}</p>}
          </div>
        </div>
      )}
      
      <div className="card__content">{children}</div>
      
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
};

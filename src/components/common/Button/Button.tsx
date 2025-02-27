import React from 'react';
import classNames from 'classnames';
import { ButtonProps } from './Button.types';
import './Button.scss';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  icon,
  onClick,
  type = 'button',
  className,
}) => {
  const buttonClasses = classNames(
    'button',
    `button--${variant}`,
    `button--${size}`,
    {
      'button--full-width': fullWidth,
    },
    className
  );

  // Vérification d'erreur en dev : Pas de texte (children) ni icône
  if (!children && !icon) {
    console.warn('Button component should have at least either text (children) or an icon.');
  }

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && (
        <span
          className={classNames('button__icon', {
            'button__icon--only': !children, // Classe spécifique si seul l'icône est présent
          })}
        >
          {icon}
        </span>
      )}
      {children}
    </button>
  );
};

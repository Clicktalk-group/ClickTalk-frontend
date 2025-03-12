import React, { useMemo, useCallback } from 'react';
import classNames from 'classnames';
import { ButtonProps } from './Button.types';
import './Button.scss';

export const Button = React.memo(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  icon,
  onClick,
  type = 'button',
  className,
  title,
}: ButtonProps) => {
  // Mémoïsation des noms de classes pour éviter de les recalculer à chaque rendu
  const buttonClasses = useMemo(() => 
    classNames(
      'button',
      `button--${variant}`,
      `button--${size}`,
      {
        'button--full-width': fullWidth,
      },
      className
    ), 
    [variant, size, fullWidth, className]
  );

  // Mémoïsation des classes d'icônes
  const iconClasses = useMemo(() => 
    icon ? classNames('button__icon', {
      'button__icon--only': !children,
    }) : '',
    [icon, children]
  );

  // Mémoïsation de la fonction de clic
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  }, [disabled, onClick]);

  // Vérification d'erreur en dev : Pas de texte (children) ni icône
  if (process.env.NODE_ENV === 'development' && !children && !icon) {
    console.warn('Button component should have at least either text (children) or an icon.');
  }

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled}
      title={title}
    >
      {icon && (
        <span className={iconClasses}>
          {icon}
        </span>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

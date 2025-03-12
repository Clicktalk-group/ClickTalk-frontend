import React, { useCallback, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { NavigationProps, NavigationItem as NavItem } from './Navigation.types';
import './Navigation.scss';

// Composant d'élément de navigation mémorisé
const NavigationItem = memo(({ 
  item, 
  isActive, 
  onClick 
}: { 
  item: NavItem; 
  isActive: boolean; 
  onClick: (path: string) => void;
}) => {
  const handleClick = useCallback(() => {
    onClick(item.path);
  }, [onClick, item.path]);

  const itemClasses = useMemo(() => 
    classNames('navigation-item', { active: isActive })
  , [isActive]); 

  return (
    <li key={item.id}>
      <Link
        to={item.path}
        className={itemClasses}
        onClick={handleClick}
        aria-current={isActive ? 'page' : undefined}
      >
        {item.icon && (
          <span className="navigation-icon" aria-hidden="true">
            {item.icon}
          </span>
        )}
        <span className="navigation-label">{item.label}</span>
      </Link>
    </li>
  );
});

NavigationItem.displayName = 'NavigationItem';

export const Navigation: React.FC<NavigationProps> = memo(({
  items,
  currentPath,
  onNavigate,
  className,
}) => {
  const handleLinkClick = useCallback((path: string) => {
    if (currentPath !== path) {
      onNavigate(path);
    }
  }, [currentPath, onNavigate]);

  const navClasses = useMemo(() => 
    classNames('navigation', className)
  , [className]);

  return (
    <nav className={navClasses} role="navigation" aria-label="Main Navigation">
      <ul className="navigation-list">
        {items.map((item) => (
          <NavigationItem
            key={item.id}
            item={item}
            isActive={currentPath === item.path}
            onClick={handleLinkClick}
          />
        ))}
      </ul>
    </nav>
  );
});

Navigation.displayName = 'Navigation';

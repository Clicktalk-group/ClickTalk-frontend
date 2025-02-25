import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { NavigationProps } from './Navigation.types';
import './Navigation.scss';

export const Navigation: React.FC<NavigationProps> = ({
  items,
  currentPath,
  onNavigate,
  className
}) => {
  const handleClick = (path: string) => {
    onNavigate(path);
  };

  return (
    <nav className={classNames('navigation', className)} role="navigation">
      <ul className="navigation-list">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              to={item.path}
              className={classNames('navigation-item', {
                active: currentPath === item.path
              })}
              onClick={() => handleClick(item.path)}
              aria-current={currentPath === item.path ? 'page' : undefined}
            >
              {item.icon && <span className="navigation-icon">{item.icon}</span>}
              <span className="navigation-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

Navigation.displayName = 'Navigation';
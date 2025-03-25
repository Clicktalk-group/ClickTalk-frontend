import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navigation } from './Navigation';

describe('Navigation', () => {
  const mockItems = [
    { id: '1', label: 'Home', path: '/' },
    { id: '2', label: 'Chat', path: '/chat' },
    { id: '3', label: 'Settings', path: '/settings' },
  ];

  const defaultProps = {
    items: mockItems,
    currentPath: '/',
    onNavigate: jest.fn(),
  };

  const renderWithRouter = (ui: React.ReactElement) => {
    return render(ui, { wrapper: BrowserRouter });
  };

  it('renders all navigation items', () => {
    renderWithRouter(<Navigation {...defaultProps} />);
    mockItems.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  it('marks the current path as active', () => {
    renderWithRouter(<Navigation {...defaultProps} currentPath="/chat" />);
    const activeLink = screen.getByRole('link', { name: 'Chat' });
    expect(activeLink).toHaveClass('active');
  });

  it('calls onNavigate when clicking a link', () => {
    renderWithRouter(<Navigation {...defaultProps} />);
    fireEvent.click(screen.getByText('Chat'));
    expect(defaultProps.onNavigate).toHaveBeenCalledWith('/chat');
  });

  it('adds a custom class', () => {
    const customClass = 'custom-navigation';
    renderWithRouter(<Navigation {...defaultProps} className={customClass} />);
    expect(screen.getByRole('navigation')).toHaveClass(customClass);
  });

  it('handles missing icons gracefully', () => {
    renderWithRouter(<Navigation {...defaultProps} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument(); // Vérifie si aucun icône n’est nécessaire
  });
});

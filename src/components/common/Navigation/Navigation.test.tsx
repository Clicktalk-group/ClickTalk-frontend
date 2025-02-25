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
    mockItems.forEach(item => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  it('marks current path as active', () => {
    renderWithRouter(<Navigation {...defaultProps} currentPath="/chat" />);
    const chatLink = screen.getByRole('link', { name: 'Chat' });
    expect(chatLink).toHaveClass('active');
  });

  it('calls onNavigate when clicking a link', () => {
    renderWithRouter(<Navigation {...defaultProps} />);
    fireEvent.click(screen.getByText('Chat'));
    expect(defaultProps.onNavigate).toHaveBeenCalledWith('/chat');
  });

  it('applies custom className', () => {
    renderWithRouter(<Navigation {...defaultProps} className="custom-nav" />);
    expect(screen.getByRole('navigation')).toHaveClass('custom-nav');
  });
});

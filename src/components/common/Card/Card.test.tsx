import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from './Card';

describe('Card Component', () => {
  it('renders children content correctly', () => {
    render(<Card>Test Content</Card>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders title and subtitle when provided', () => {
    render(<Card title="Test Title" subtitle="Test Subtitle">Content</Card>);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('executes onClick callback when clicked', () => {
    const handleClick = jest.fn();
    render(<Card onClick={handleClick}>Clickable Card</Card>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders footer content when provided', () => {
    render(<Card footer={<div>Footer Content</div>}>Content</Card>);
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('applies hover class when hover prop is true', () => {
    render(<Card hover data-testid="card">Content</Card>);
    expect(screen.getByTestId('card')).toHaveClass('card--hover');
  });

  it('renders icon when provided', () => {
    const TestIcon = () => <svg data-testid="test-icon" />;
    render(<Card icon={<TestIcon />}>Content</Card>);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('adds appropriate ARIA label for accessibility', () => {
    render(<Card title="Accessible Card">Content</Card>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Accessible Card');
  });
});
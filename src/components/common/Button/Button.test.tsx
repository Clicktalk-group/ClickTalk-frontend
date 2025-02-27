import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant class', () => {
    render(<Button variant="secondary">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--secondary');
  });

  it('applies correct size class', () => {
    render(<Button size="lg">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--lg');
  });

  it('can be disabled', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders with only an icon', () => {
    const icon = <span data-testid="test-icon">icon</span>;
    render(<Button icon={icon} />);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('renders with an icon and text', () => {
    const icon = <span data-testid="test-icon">icon</span>;
    render(<Button icon={icon}>Click me</Button>);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText(/click me/i)).toBeInTheDocument();
  });

  it('logs a warning if no children or icon is provided', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    render(<Button />);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Button component should have at least either text (children) or an icon.'
    );
  });
});

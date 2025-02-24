import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  const defaultProps = {
    name: 'test-input',
    value: '',
    onChange: jest.fn(),
  };

  it('renders correctly', () => {
    render(<Input {...defaultProps} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('displays label when provided', () => {
    render(<Input {...defaultProps} label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('shows error message when error prop is provided', () => {
    const errorMessage = 'This is an error';
    render(<Input {...defaultProps} error={errorMessage} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('calls onChange when input value changes', () => {
    const onChange = jest.fn();
    render(<Input {...defaultProps} onChange={onChange} />);
    
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'test' },
    });
    
    expect(onChange).toHaveBeenCalled();
  });

  it('can be disabled', () => {
    render(<Input {...defaultProps} disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('displays required star when required prop is true', () => {
    render(<Input {...defaultProps} label="Test Label" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});

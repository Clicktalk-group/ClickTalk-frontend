import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';

describe('Input Component', () => {
  const defaultProps = {
    name: 'test-input',
    value: '',
    onChange: jest.fn(),
  };

  it('renders correctly with basic props', () => {
    render(<Input {...defaultProps} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('displays label when it is provided', () => {
    render(<Input {...defaultProps} label="Sample Label" />);
    expect(screen.getByText('Sample Label')).toBeInTheDocument();
  });

  it('renders the required star when `required` prop is true', () => {
    render(<Input {...defaultProps} label="Sample Label" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows error message when error prop is provided', () => {
    const errorMessage = 'Error occurred';
    render(<Input {...defaultProps} error={errorMessage} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('calls `onChange` when the input is typed', () => {
    const onChange = jest.fn();
    render(<Input {...defaultProps} onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Hello' } });
    expect(onChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it('is disabled when `disabled` prop is true', () => {
    render(<Input {...defaultProps} disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('renders an icon if the `icon` prop is passed', () => {
    render(<Input {...defaultProps} icon={<span data-testid="icon">icon</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});

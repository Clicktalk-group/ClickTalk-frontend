import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

describe('Modal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    children: <div>Test Content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(<Modal {...defaultProps} title="Test Modal" />);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('calls onClose when clicking outside of the modal', () => {
    render(<Modal {...defaultProps} />);
    const modalBackdrop = screen.getByRole('dialog');
    fireEvent.click(modalBackdrop);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', () => {
    render(<Modal {...defaultProps} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('assigns appropriate size class', () => {
    render(<Modal {...defaultProps} size="sm" />);
    const modalContent = screen.getByTestId('modal-content');
    expect(modalContent).toHaveClass('modal-content', 'sm');
  });

  it('renders close button and calls onClose when clicked', () => {
    render(<Modal {...defaultProps} />);
    const closeButton = screen.getByRole('button', { name: /close modal/i });
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('does not call onClose if clicking inside the modal content', () => {
    render(<Modal {...defaultProps} />);
    const modalContent = screen.getByTestId('modal-content');
    fireEvent.click(modalContent);
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });
});
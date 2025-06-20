import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ButtonToggle } from './component';

describe('ButtonToggle', () => {
  const defaultProps = {
    isActive: false,
    onToggle: jest.fn(),
    theme: 'light' as const,
    'aria-label': 'Test toggle button'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with inactive state', () => {
    render(
      <ButtonToggle {...defaultProps}>
        Toggle Off
      </ButtonToggle>
    );

    const button = screen.getByRole('button', { name: 'Test toggle button' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveTextContent('Toggle Off');
  });

  it('renders correctly with active state', () => {
    render(
      <ButtonToggle {...defaultProps} isActive={true}>
        Toggle On
      </ButtonToggle>
    );

    const button = screen.getByRole('button', { name: 'Test toggle button' });
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveTextContent('Toggle On');
  });

  it('calls onToggle when clicked', () => {
    const mockToggle = jest.fn();
    render(
      <ButtonToggle {...defaultProps} onToggle={mockToggle}>
        Toggle
      </ButtonToggle>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('supports keyboard navigation', () => {
    const mockToggle = jest.fn();
    render(
      <ButtonToggle {...defaultProps} onToggle={mockToggle}>
        Toggle
      </ButtonToggle>
    );

    const button = screen.getByRole('button');
    
    // Test Enter key
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(mockToggle).toHaveBeenCalledTimes(1);

    // Test Space key
    fireEvent.keyDown(button, { key: ' ' });
    expect(mockToggle).toHaveBeenCalledTimes(2);
  });

  it('does not call onToggle when disabled', () => {
    const mockToggle = jest.fn();
    render(
      <ButtonToggle {...defaultProps} onToggle={mockToggle} disabled={true}>
        Disabled Toggle
      </ButtonToggle>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);
    fireEvent.keyDown(button, { key: 'Enter' });

    expect(mockToggle).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  it('applies theme-specific styles', () => {
    const { rerender } = render(
      <ButtonToggle {...defaultProps} theme="light" isActive={false}>
        Light Theme
      </ButtonToggle>
    );

    let button = screen.getByRole('button');
    expect(button).toHaveStyle({ background: '#d1d5db' });

    rerender(
      <ButtonToggle {...defaultProps} theme="dark" isActive={false}>
        Dark Theme
      </ButtonToggle>
    );

    button = screen.getByRole('button');
    expect(button).toHaveStyle({ background: '#6b7280' });
  });

  it('applies active state styles', () => {
    const { rerender } = render(
      <ButtonToggle {...defaultProps} theme="light" isActive={true}>
        Active Light
      </ButtonToggle>
    );

    let button = screen.getByRole('button');
    expect(button).toHaveStyle({ background: '#22c55e' });

    rerender(
      <ButtonToggle {...defaultProps} theme="dark" isActive={true}>
        Active Dark
      </ButtonToggle>
    );

    button = screen.getByRole('button');
    expect(button).toHaveStyle({ background: '#10b981' });
  });
});
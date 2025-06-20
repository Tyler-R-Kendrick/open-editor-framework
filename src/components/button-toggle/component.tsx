import React from 'react';
import { EditorTheme } from '../../types/editor-types';

export interface ButtonToggleProps {
  /** Whether the toggle is currently active/pressed */
  isActive: boolean;
  /** Function called when toggle is clicked */
  onToggle: () => void;
  /** Theme for styling */
  theme: EditorTheme;
  /** Content to display inside the button */
  children: React.ReactNode;
  /** Accessible label for the button */
  'aria-label': string;
  /** Additional CSS class name */
  className?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
}

/**
 * A reusable toggle button component with theme-aware styling
 * Features:
 * - Theme-aware colors (dark/light mode support)
 * - Active/inactive state styling
 * - Accessibility support with proper ARIA attributes
 * - Smooth transitions and hover effects
 * - Touch-optimized sizing
 */
export const ButtonToggle: React.FC<ButtonToggleProps> = ({
  isActive,
  onToggle,
  theme,
  children,
  'aria-label': ariaLabel,
  className = '',
  disabled = false
}) => {
  const getButtonStyles = (): React.CSSProperties => ({
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    background: isActive 
      ? (theme === 'dark' ? '#10b981' : '#22c55e')
      : (theme === 'dark' ? '#6b7280' : '#d1d5db'),
    color: isActive 
      ? '#ffffff' 
      : (theme === 'dark' ? '#d1d5db' : '#374151'),
    fontSize: '14px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.6 : 1,
    // Ensure minimum touch target size for accessibility
    minHeight: '44px',
    minWidth: '44px',
  });

  const handleClick = () => {
    if (!disabled) {
      onToggle();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      aria-pressed={isActive}
      disabled={disabled}
      className={className}
      style={getButtonStyles()}
    >
      {children}
    </button>
  );
};
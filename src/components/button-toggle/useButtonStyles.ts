import { EditorTheme } from '../../types/editor-types';

/**
 * Custom hook that provides consistent button styling across the application
 * Returns style objects for different button types with theme awareness
 */
export const useButtonStyles = (theme: EditorTheme) => {
  const getBaseButtonStyles = () => ({
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    minHeight: '44px',
    minWidth: '44px',
  });

  const getPrimaryButtonStyles = () => ({
    ...getBaseButtonStyles(),
    padding: '8px 12px',
    background: theme === 'dark' ? '#6366f1' : '#8b5cf6',
    color: '#ffffff',
  });

  const getSecondaryButtonStyles = () => ({
    ...getBaseButtonStyles(),
    padding: '8px 12px',
    background: theme === 'dark' ? '#4b5563' : '#f3f4f6',
    color: theme === 'dark' ? '#f8fafc' : '#1e293b',
    border: `1px solid ${theme === 'dark' ? '#6b7280' : '#d1d5db'}`,
  });

  const getDestructiveButtonStyles = () => ({
    ...getBaseButtonStyles(),
    padding: '4px 8px',
    background: 'none',
    color: theme === 'dark' ? '#f87171' : '#dc2626',
    fontSize: '12px',
  });

  return {
    primary: getPrimaryButtonStyles(),
    secondary: getSecondaryButtonStyles(),
    destructive: getDestructiveButtonStyles(),
  };
};
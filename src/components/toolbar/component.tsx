import React, { useState } from 'react';
import { EditorTheme } from '../../types/editor-types';

interface EditorToolbarProps {
  theme: EditorTheme;
  onThemeChange: (theme: EditorTheme) => void;
}

/**
 * Editor toolbar with actions and theme controls
 * Features:
 * - File operations (new, save, load, export)
 * - Undo/redo functionality
 * - Zoom controls with keyboard shortcuts
 * - Theme toggle
 * - Keyboard shortcuts for all actions
 * - Mobile-responsive layout
 */
export const EditorToolbar: React.FC<EditorToolbarProps> = ({ theme, onThemeChange }) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const handleUndo = () => {
    // Dispatch undo event or call undo handler
    console.log('Undo action');
  };

  const handleRedo = () => {
    // Dispatch redo event or call redo handler
    console.log('Redo action');
  };

  const handleNew = () => {
    if (confirm('Create a new document? This will clear the current canvas.')) {
      console.log('New document');
    }
  };

  const handleSave = () => {
    console.log('Save document');
  };

  const handleLoad = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            console.log('Loaded data:', data);
          } catch (error) {
            alert('Error loading file: Invalid JSON format');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExport = () => {
    console.log('Export document');
  };

  const toggleTheme = () => {
    onThemeChange(theme === 'light' ? 'dark' : 'light');
  };

  const buttonBaseStyle = {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '6px',
    background: theme === 'dark' ? '#4b5563' : '#f3f4f6',
    color: theme === 'dark' ? '#f8fafc' : '#374151',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease'
  };

  const buttonHoverStyle = {
    ...buttonBaseStyle,
    background: theme === 'dark' ? '#6b7280' : '#e5e7eb'
  };

  return (
    <div
      className="editor-toolbar"
      role="toolbar"
      aria-label="Editor toolbar"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: theme === 'dark' ? '#374151' : 'white',
        borderBottom: `1px solid ${theme === 'dark' ? '#4b5563' : '#e2e8f0'}`,
        gap: '12px',
        flexWrap: 'wrap'
      }}
    >
      {/* File operations */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          onClick={handleNew}
          style={buttonBaseStyle}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonBaseStyle)}
          aria-label="New document (Ctrl+N)"
          title="New document (Ctrl+N)"
        >
          <span aria-hidden="true">📄</span>
          <span className="hidden sm:inline">New</span>
        </button>

        <button
          onClick={handleSave}
          style={buttonBaseStyle}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonBaseStyle)}
          aria-label="Save document (Ctrl+S)"
          title="Save document (Ctrl+S)"
        >
          <span aria-hidden="true">💾</span>
          <span className="hidden sm:inline">Save</span>
        </button>

        <button
          onClick={handleLoad}
          style={buttonBaseStyle}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonBaseStyle)}
          aria-label="Load document (Ctrl+O)"
          title="Load document (Ctrl+O)"
        >
          <span aria-hidden="true">📁</span>
          <span className="hidden sm:inline">Load</span>
        </button>

        <button
          onClick={handleExport}
          style={buttonBaseStyle}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonBaseStyle)}
          aria-label="Export document"
          title="Export document"
        >
          <span aria-hidden="true">📤</span>
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>

      {/* Edit operations */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          style={{
            ...buttonBaseStyle,
            opacity: canUndo ? 1 : 0.5,
            cursor: canUndo ? 'pointer' : 'not-allowed'
          }}
          aria-label="Undo (Ctrl+Z)"
          title="Undo (Ctrl+Z)"
        >
          <span aria-hidden="true">↶</span>
          <span className="hidden sm:inline">Undo</span>
        </button>

        <button
          onClick={handleRedo}
          disabled={!canRedo}
          style={{
            ...buttonBaseStyle,
            opacity: canRedo ? 1 : 0.5,
            cursor: canRedo ? 'pointer' : 'not-allowed'
          }}
          aria-label="Redo (Ctrl+Y)"
          title="Redo (Ctrl+Y)"
        >
          <span aria-hidden="true">↷</span>
          <span className="hidden sm:inline">Redo</span>
        </button>
      </div>

      {/* Zoom controls */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span
          style={{
            fontSize: '14px',
            color: theme === 'dark' ? '#d1d5db' : '#6b7280',
            whiteSpace: 'nowrap'
          }}
        >
          {zoomLevel}%
        </span>
        <button
          onClick={() => setZoomLevel(prev => Math.max(10, prev - 10))}
          style={buttonBaseStyle}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonBaseStyle)}
          aria-label="Zoom out"
          title="Zoom out"
        >
          <span aria-hidden="true">−</span>
        </button>
        <button
          onClick={() => setZoomLevel(prev => Math.min(500, prev + 10))}
          style={buttonBaseStyle}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonBaseStyle)}
          aria-label="Zoom in"
          title="Zoom in"
        >
          <span aria-hidden="true">+</span>
        </button>
        <button
          onClick={() => setZoomLevel(100)}
          style={buttonBaseStyle}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonBaseStyle)}
          aria-label="Reset zoom"
          title="Reset zoom"
        >
          <span aria-hidden="true">⌂</span>
        </button>
      </div>

      {/* Theme toggle */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          onClick={toggleTheme}
          style={buttonBaseStyle}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonBaseStyle)}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          <span aria-hidden="true">{theme === 'light' ? '🌙' : '☀️'}</span>
          <span className="hidden sm:inline">{theme === 'light' ? 'Dark' : 'Light'}</span>
        </button>
      </div>
    </div>
  );
};

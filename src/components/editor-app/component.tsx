import React, { useCallback, useEffect, useState } from 'react';
import { EditorTheme } from '../../types/editor-types';
import { EditorToolbar } from '../toolbar/component';
import { ComponentPalette } from '../component-palette/component';
import { EditorCanvas } from '../editor-canvas/component';
import { ControlPanel } from '../control-panel/component';

/**
 * Main editor application using a simple flex layout
 */
export const EditorApp: React.FC = () => {
  const [theme, setTheme] = useState<EditorTheme>('light');

  const handleThemeChange = useCallback((e: MediaQueryListEvent | MediaQueryList) => {
    setTheme(e.matches ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleThemeChange);
    handleThemeChange(mediaQuery);
    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, [handleThemeChange]);

  const borderColor = theme === 'dark' ? '#374151' : '#e2e8f0';


  const handleThemeToggle = (newTheme: EditorTheme) => {
    setTheme(newTheme);
  };

  return (
    <div
      className="editor-container"
      role="application"
      aria-label="React Component Editor"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: theme === 'dark' ? '#1e293b' : '#f8fafc',
        color: theme === 'dark' ? '#f8fafc' : '#1e293b'
      }}
    >
      <div style={{ height: '60px', borderBottom: `1px solid ${borderColor}`, background: theme === 'dark' ? '#374151' : 'white' }}>
        <EditorToolbar theme={theme} onThemeChange={handleThemeToggle} />
      </div>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ width: '250px', borderRight: `1px solid ${borderColor}`, overflow: 'auto' }}>
          <ComponentPalette theme={theme} aria-label="Component Library" />
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <EditorCanvas theme={theme} aria-label="Design Canvas" />
        </div>
        <div style={{ width: '300px', borderLeft: `1px solid ${borderColor}`, overflow: 'auto' }}>
          <ControlPanel theme={theme} aria-label="Properties Panel" />
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { EditorTheme } from '../../types/editor-types';
import { EditorToolbar } from '../toolbar/component';
import { ComponentPalette } from '../component-palette/component';
import { EditorCanvas } from '../editor-canvas/component';
import { ControlPanel } from '../control-panel/component';

/**
 * Main editor application component that orchestrates the canvas, palette, and control panel
 * Supports touch interactions and accessibility features
 */
export const EditorApp: React.FC = () => {
  const [theme, setTheme] = useState<EditorTheme>('light');
  const [isMobile, setIsMobile] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'palette' | 'canvas' | 'controls'>('canvas');

  const checkMobileLayout = useCallback(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  const handleThemeChange = useCallback((e: MediaQueryListEvent | MediaQueryList) => {
    setTheme(e.matches ? 'dark' : 'light');
  }, []);

  const handleResize = useCallback(() => {
    checkMobileLayout();
  }, [checkMobileLayout]);

  useEffect(() => {
    checkMobileLayout();
    window.addEventListener('resize', handleResize);

    // Listen for theme preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleThemeChange);
    handleThemeChange(mediaQuery);

    return () => {
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, [handleResize, handleThemeChange]);

  const handleMobileTabClick = (tab: 'palette' | 'canvas' | 'controls') => {
    setActiveMobileTab(tab);

    // Provide haptic feedback on supported devices
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    // Add touch feedback animation
    const target = e.currentTarget;
    target.style.transform = 'scale(0.95)';
    setTimeout(() => {
      target.style.transform = '';
    }, 100);
  };

  const handleThemeToggle = (newTheme: EditorTheme) => {
    setTheme(newTheme);
  };

  return (
    <div 
      className="editor-container" 
      role="application" 
      aria-label="React Component Editor"
      style={{
        display: 'grid',
        gridTemplateAreas: isMobile 
          ? `'toolbar' 'mobile-content' 'mobile-tabs'`
          : `'toolbar toolbar toolbar' 'palette canvas controls'`,
        gridTemplateColumns: isMobile ? '1fr' : '280px 1fr 320px',
        gridTemplateRows: isMobile ? '60px 1fr 60px' : '60px 1fr',
        height: '100vh',
        background: theme === 'dark' ? '#1e293b' : '#f8fafc',
        gap: '1px',
        overflow: 'hidden',
        touchAction: 'manipulation',
        color: theme === 'dark' ? '#f8fafc' : '#1e293b'
      }}
    >
      <div 
        className="toolbar-area"
        style={{
          gridArea: 'toolbar',
          borderBottom: `1px solid ${theme === 'dark' ? '#374151' : '#e2e8f0'}`,
          background: theme === 'dark' ? '#374151' : 'white'
        }}
      >
        <EditorToolbar 
          theme={theme}
          onThemeChange={handleThemeToggle}
        />
      </div>

      <div 
        className={`palette-area ${isMobile && activeMobileTab === 'palette' ? 'mobile-active' : ''}`}
        style={{
          gridArea: isMobile ? 'mobile-content' : 'palette',
          background: theme === 'dark' ? '#374151' : 'white',
          borderRight: !isMobile ? `1px solid ${theme === 'dark' ? '#374151' : '#e2e8f0'}` : 'none',
          overflow: 'hidden',
          display: isMobile && activeMobileTab !== 'palette' ? 'none' : 'block'
        }}
      >
        <ComponentPalette 
          theme={theme}
          aria-label="Component Library"
        />
      </div>

      <div 
        className={`canvas-area ${!isMobile || activeMobileTab === 'canvas' ? 'mobile-active' : ''}`}
        style={{
          gridArea: isMobile ? 'mobile-content' : 'canvas',
          background: theme === 'dark' ? '#1e293b' : '#f8fafc',
          position: 'relative',
          overflow: 'hidden',
          display: isMobile && activeMobileTab !== 'canvas' ? 'none' : 'block'
        }}
      >
        <EditorCanvas 
          theme={theme}
          aria-label="Design Canvas"
        />
      </div>

      <div 
        className={`controls-area ${isMobile && activeMobileTab === 'controls' ? 'mobile-active' : ''}`}
        style={{
          gridArea: isMobile ? 'mobile-content' : 'controls',
          background: theme === 'dark' ? '#374151' : 'white',
          borderLeft: !isMobile ? `1px solid ${theme === 'dark' ? '#374151' : '#e2e8f0'}` : 'none',
          overflow: 'hidden',
          display: isMobile && activeMobileTab !== 'controls' ? 'none' : 'block'
        }}
      >
        <ControlPanel 
          theme={theme}
          aria-label="Properties Panel"
        />
      </div>

      {isMobile && (
        <div 
          className="mobile-tabs" 
          role="tablist" 
          aria-label="Editor Sections"
          style={{
            gridArea: 'mobile-tabs',
            background: theme === 'dark' ? '#374151' : 'white',
            borderTop: `1px solid ${theme === 'dark' ? '#374151' : '#e2e8f0'}`,
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}
        >
          <button 
            className={`mobile-tab ${activeMobileTab === 'palette' ? 'active' : ''}`}
            role="tab"
            aria-selected={activeMobileTab === 'palette'}
            aria-controls="palette-panel"
            onClick={() => handleMobileTabClick('palette')}
            onTouchStart={handleTouchStart}
            style={{
              flex: 1,
              height: '100%',
              border: 'none',
              background: activeMobileTab === 'palette' ? '#f1f5f9' : 'transparent',
              color: activeMobileTab === 'palette' ? '#3b82f6' : (theme === 'dark' ? '#9ca3af' : '#64748b'),
              fontSize: '14px',
              cursor: 'pointer',
              touchAction: 'manipulation',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <span aria-hidden="true">🎨</span>
            Components
          </button>
          <button 
            className={`mobile-tab ${activeMobileTab === 'canvas' ? 'active' : ''}`}
            role="tab"
            aria-selected={activeMobileTab === 'canvas'}
            aria-controls="canvas-panel"
            onClick={() => handleMobileTabClick('canvas')}
            onTouchStart={handleTouchStart}
            style={{
              flex: 1,
              height: '100%',
              border: 'none',
              background: activeMobileTab === 'canvas' ? '#f1f5f9' : 'transparent',
              color: activeMobileTab === 'canvas' ? '#3b82f6' : (theme === 'dark' ? '#9ca3af' : '#64748b'),
              fontSize: '14px',
              cursor: 'pointer',
              touchAction: 'manipulation',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <span aria-hidden="true">🎯</span>
            Canvas
          </button>
          <button 
            className={`mobile-tab ${activeMobileTab === 'controls' ? 'active' : ''}`}
            role="tab"
            aria-selected={activeMobileTab === 'controls'}
            aria-controls="controls-panel"
            onClick={() => handleMobileTabClick('controls')}
            onTouchStart={handleTouchStart}
            style={{
              flex: 1,
              height: '100%',
              border: 'none',
              background: activeMobileTab === 'controls' ? '#f1f5f9' : 'transparent',
              color: activeMobileTab === 'controls' ? '#3b82f6' : (theme === 'dark' ? '#9ca3af' : '#64748b'),
              fontSize: '14px',
              cursor: 'pointer',
              touchAction: 'manipulation',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <span aria-hidden="true">⚙️</span>
            Properties
          </button>
        </div>
      )}
    </div>
  );
};

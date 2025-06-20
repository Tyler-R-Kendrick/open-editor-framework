import React, { useCallback, useEffect, useState } from 'react';
import { EditorTheme, CanvasSize } from '../../types/editor-types';
import { EditorToolbar } from '../toolbar/component';
import { ComponentPalette } from '../component-palette/component';
import { EditorCanvas } from '../editor-canvas/component';
import { ControlPanel } from '../control-panel/component';
import {
  Provider as SpectrumProvider,
  defaultTheme
} from '@adobe/react-spectrum';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../../store';
import { I18nProvider } from '@react-aria/i18n';

/**
 * Main editor application using a simple flex layout
 */
export const EditorApp: React.FC = () => {
  const [theme, setTheme] = useState<EditorTheme>('light');
  const [showPalette, setShowPalette] = useState(true);
  const [showControl, setShowControl] = useState(true);
  const [canvasSize, setCanvasSize] = useState<CanvasSize>('infinite');

  const handleThemeChange = useCallback(
    (e: MediaQueryListEvent | MediaQueryList) => {
      setTheme(e.matches ? 'dark' : 'light');
    },
    []
  );

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
    <ReduxProvider store={store}>
      <I18nProvider locale={navigator.language}>
        <SpectrumProvider theme={defaultTheme} colorScheme={theme}>
          <div
            className="editor-container"
            role="application"
            aria-label="React Component Editor"
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              background: theme === 'dark' ? '#1e293b' : '#f8fafc',
              color: theme === 'dark' ? '#f8fafc' : '#1e293b'
            }}
          >
            <div
              style={{
                height: '60px',
                borderBottom: `1px solid ${borderColor}`,
                background: theme === 'dark' ? '#374151' : 'white'
              }}
            >
              <EditorToolbar
                theme={theme}
                onThemeChange={handleThemeToggle}
                canvasSize={canvasSize}
                onCanvasSizeChange={setCanvasSize}
              />
            </div>
            <div
              style={{
                display: 'flex',
                flex: 1,
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {showPalette && (
                <div
                  style={{
                    width: '250px',
                    borderRight: `1px solid ${borderColor}`,
                    overflow: 'auto',
                    position: 'relative'
                  }}
                >
                  <button
                    onClick={() => setShowPalette(false)}
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      zIndex: 10
                    }}
                    aria-label="Collapse component palette"
                  >
                    «
                  </button>
                  <ComponentPalette
                    theme={theme}
                    aria-label="Component Library"
                  />
                </div>
              )}
              <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
                {!showPalette && (
                  <button
                    onClick={() => setShowPalette(true)}
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      zIndex: 10
                    }}
                    aria-label="Expand component palette"
                  >
                    »
                  </button>
                )}
                {!showControl && (
                  <button
                    onClick={() => setShowControl(true)}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 4,
                      zIndex: 10
                    }}
                    aria-label="Expand properties panel"
                  >
                    «
                  </button>
                )}
                <EditorCanvas
                  theme={theme}
                  canvasSize={canvasSize}
                  aria-label="Design Canvas"
                />
              </div>
              {showControl && (
                <div
                  style={{
                    width: '300px',
                    borderLeft: `1px solid ${borderColor}`,
                    overflow: 'auto',
                    position: 'relative'
                  }}
                >
                  <button
                    onClick={() => setShowControl(false)}
                    style={{
                      position: 'absolute',
                      top: 4,
                      left: 4,
                      zIndex: 10
                    }}
                    aria-label="Collapse properties panel"
                  >
                    »
                  </button>
                  <ControlPanel theme={theme} aria-label="Properties Panel" />
                </div>
              )}
            </div>
          </div>
        </SpectrumProvider>
      </I18nProvider>
    </ReduxProvider>
  );
};

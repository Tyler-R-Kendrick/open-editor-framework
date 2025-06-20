import React, { useCallback, useEffect, useState } from 'react';
import { EditorTheme } from '../../types/editor-types';
import type { Resolution } from '../../types/editor-types';
import { EditorToolbar } from '../toolbar/component';
import { ComponentPalette } from '../component-palette/component';
import { EditorCanvas } from '../editor-canvas/component';
import { ControlPanel } from '../control-panel/component';
import {
  Provider as SpectrumProvider,
  defaultTheme
} from '@adobe/react-spectrum';
import { Provider as ReduxProvider } from 'react-redux';
import { store, setComponents } from '../../store';
import { I18nProvider } from '@react-aria/i18n';
import { decodeComponents } from '../../utils/share';
import type { BaseComponent } from '../../types/component-base';

/**
 * Main editor application using a simple flex layout
 */
export const EditorApp: React.FC = () => {
  const [theme, setTheme] = useState<EditorTheme>('light');
  const [showPalette, setShowPalette] = useState(true);
  const [showControl, setShowControl] = useState(true);
  const [resolution, setResolution] = useState<Resolution | undefined>(
    undefined
  );

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

  useEffect(() => {
    const params = new window.URLSearchParams(window.location.search);
    const state = params.get('state');
    if (state) {
      const components = decodeComponents(state);
      if (Array.isArray(components)) {
        store.dispatch(setComponents(components as BaseComponent[]));
      }
    }
  }, []);

  const handleThemeToggle = (newTheme: EditorTheme) => {
    setTheme(newTheme);
  };

  return (
    <ReduxProvider store={store}>
      <I18nProvider locale={navigator.language}>
        <SpectrumProvider theme={defaultTheme} colorScheme={theme}>
          <div
            className={`editor-container flex flex-col w-full h-full ${
              theme === 'dark'
                ? 'bg-slate-800 text-slate-100'
                : 'bg-slate-50 text-slate-900'
            }`}
            role="application"
            aria-label="React Component Editor"
          >
            <div
              className={`h-[60px] border-b ${
                theme === 'dark'
                  ? 'border-slate-700 bg-slate-700'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <EditorToolbar
                theme={theme}
                onThemeChange={handleThemeToggle}
                resolution={resolution}
                onResolutionChange={setResolution}
              />
            </div>
            <div className="relative flex flex-1 overflow-hidden">
              {showPalette && (
                <div
                  className={`relative w-[250px] overflow-auto border-r ${
                    theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
                  }`}
                >
                  <button
                    onClick={() => setShowPalette(false)}
                    className={`absolute right-1 top-1 z-10 rounded border p-1 text-xs transition-colors ${
                      theme === 'dark'
                        ? 'border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600'
                        : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
                    }`}
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
              <div className="relative flex-1 overflow-auto">
                {!showPalette && (
                  <button
                    onClick={() => setShowPalette(true)}
                    className={`absolute left-0 top-1 z-10 rounded border p-1 text-xs transition-colors ${
                      theme === 'dark'
                        ? 'border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600'
                        : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                    aria-label="Expand component palette"
                  >
                    »
                  </button>
                )}
                {!showControl && (
                  <button
                    onClick={() => setShowControl(true)}
                    className={`absolute right-0 top-1 z-10 rounded border p-1 text-xs transition-colors ${
                      theme === 'dark'
                        ? 'border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600'
                        : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                    aria-label="Expand properties panel"
                  >
                    «
                  </button>
                )}
                <EditorCanvas
                  theme={theme}
                  resolution={resolution}
                  aria-label="Design Canvas"
                />
              </div>
              {showControl && (
                <div
                  className={`relative w-[300px] overflow-auto border-l ${
                    theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
                  }`}
                >
                  <button
                    onClick={() => setShowControl(false)}
                    className={`absolute left-1 top-1 z-10 rounded border p-1 text-xs transition-colors ${
                      theme === 'dark'
                        ? 'border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600'
                        : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
                    }`}
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

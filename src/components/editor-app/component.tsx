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

  const borderClass =
    theme === 'dark' ? 'border-slate-700' : 'border-slate-200';

  const handleThemeToggle = (newTheme: EditorTheme) => {
    setTheme(newTheme);
  };

  return (
    <ReduxProvider store={store}>
      <I18nProvider locale={navigator.language}>
        <SpectrumProvider theme={defaultTheme} colorScheme={theme}>
          <div
            role="application"
            aria-label="React Component Editor"
            className={`flex flex-col w-full h-full ${
              theme === 'dark'
                ? 'bg-slate-800 text-slate-50'
                : 'bg-slate-50 text-slate-800'
            }`}
          >
            <div
              className={`h-[60px] border-b ${
                theme === 'dark' ? 'bg-slate-700' : 'bg-white'
              } ${borderClass}`}
            >
              <EditorToolbar
                theme={theme}
                onThemeChange={handleThemeToggle}
                resolution={resolution}
                onResolutionChange={setResolution}
              />
            </div>
            <div className="flex flex-1 overflow-hidden relative">
              {showPalette && (
                <div
                  className={`w-64 overflow-auto relative border-r ${borderClass}`}
                >
                  <button
                    onClick={() => setShowPalette(false)}
                    className="absolute top-1 right-1 z-10 p-1 text-xs rounded border bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
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
              <div className="flex-1 overflow-auto relative">
                {!showPalette && (
                  <button
                    onClick={() => setShowPalette(true)}
                    className="absolute left-0 top-1 z-10 p-1 text-xs rounded border bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    aria-label="Expand component palette"
                  >
                    »
                  </button>
                )}
                {!showControl && (
                  <button
                    onClick={() => setShowControl(true)}
                    className="absolute right-0 top-1 z-10 p-1 text-xs rounded border bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
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
                  className={`w-72 overflow-auto relative border-l ${borderClass}`}
                >
                  <button
                    onClick={() => setShowControl(false)}
                    className="absolute top-1 left-1 z-10 p-1 text-xs rounded border bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
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

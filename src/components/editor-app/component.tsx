import React, { useCallback, useEffect, useState } from 'react';
import { useMediaQuery } from '../../utils/useMediaQuery';
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
import { useSearchParams } from 'react-router-dom';

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
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [mobileTab, setMobileTab] = useState<'palette' | 'canvas' | 'control'>(
    'canvas'
  );

  const handleThemeChange = useCallback(
    (e: MediaQueryListEvent | MediaQueryList) => {
      setTheme(e.matches ? 'dark' : 'light');
    },
    []
  );

  useEffect(() => {
    if (!isMobile) {
      setMobileTab('canvas');
    }
  }, [isMobile]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleThemeChange);
    handleThemeChange(mediaQuery);
    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, [handleThemeChange]);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const state = searchParams.get('state');
    if (state) {
      const components = decodeComponents(state);
      if (Array.isArray(components)) {
        store.dispatch(setComponents(components as BaseComponent[]));
      }
    }
  }, [searchParams]);

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
            {isMobile ? (
              <>
                <div className="flex-1 overflow-auto">
                  {mobileTab === 'palette' && (
                    <ComponentPalette
                      theme={theme}
                      aria-label="Component Library"
                    />
                  )}
                  {mobileTab === 'canvas' && (
                    <EditorCanvas
                      theme={theme}
                      resolution={resolution}
                      aria-label="Design Canvas"
                    />
                  )}
                  {mobileTab === 'control' && (
                    <ControlPanel theme={theme} aria-label="Properties Panel" />
                  )}
                </div>
                <nav
                  className={`flex border-t ${
                    theme === 'dark'
                      ? 'bg-slate-700 border-slate-700'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <button
                    className={`flex-1 p-2 ${
                      mobileTab === 'palette' ? 'font-semibold' : ''
                    }`}
                    onClick={() => setMobileTab('palette')}
                    aria-label="Component Palette"
                  >
                    Palette
                  </button>
                  <button
                    className={`flex-1 p-2 ${
                      mobileTab === 'canvas' ? 'font-semibold' : ''
                    }`}
                    onClick={() => setMobileTab('canvas')}
                    aria-label="Canvas"
                  >
                    Canvas
                  </button>
                  <button
                    className={`flex-1 p-2 ${
                      mobileTab === 'control' ? 'font-semibold' : ''
                    }`}
                    onClick={() => setMobileTab('control')}
                    aria-label="Properties Panel"
                  >
                    Props
                  </button>
                </nav>
              </>
            ) : (
              <div className="relative flex flex-1 overflow-hidden">
                {showPalette && (
                  <div
                    className={`relative w-[250px] overflow-auto border-r ${
                      theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
                    }`}
                  >
                    <button
                      onClick={() => setShowPalette(false)}
                      className={`absolute right-1 top-1 z-10 rounded p-1 text-xs transition-colors ${
                        theme === 'dark'
                          ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                          : 'bg-white text-slate-600 hover:bg-slate-100'
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
                      className={`absolute left-0 top-1 z-10 rounded p-1 text-xs transition-colors ${
                        theme === 'dark'
                          ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                          : 'bg-white text-slate-600 hover:bg-slate-100'
                      }`}
                      aria-label="Expand component palette"
                    >
                      »
                    </button>
                  )}
                  {!showControl && (
                    <button
                      onClick={() => setShowControl(true)}
                      className={`absolute right-0 top-1 z-10 rounded p-1 text-xs transition-colors ${
                        theme === 'dark'
                          ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                          : 'bg-white text-slate-600 hover:bg-slate-100'
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
                      className={`absolute left-1 top-1 z-10 rounded p-1 text-xs transition-colors ${
                        theme === 'dark'
                          ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                          : 'bg-white text-slate-600 hover:bg-slate-100'
                      }`}
                      aria-label="Collapse properties panel"
                    >
                      »
                    </button>
                    <ControlPanel theme={theme} aria-label="Properties Panel" />
                  </div>
                )}
              </div>
            )}
          </div>
        </SpectrumProvider>
      </I18nProvider>
    </ReduxProvider>
  );
};

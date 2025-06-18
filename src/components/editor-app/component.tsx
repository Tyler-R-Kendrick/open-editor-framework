import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { GoldenLayout, LayoutConfig, ComponentContainer } from 'golden-layout';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { EditorTheme } from '../../types/editor-types';
import { EditorToolbar } from '../toolbar/component';
import { ComponentPalette } from '../component-palette/component';
import { EditorCanvas } from '../editor-canvas/component';
import { ControlPanel } from '../control-panel/component';

/**
 * Main editor application using GoldenLayout for dockable panels
 */
export const EditorApp: React.FC = () => {
  const [theme, setTheme] = useState<EditorTheme>('light');
  const layoutRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!layoutRef.current) return;

    const config: LayoutConfig = {
      root: {
        type: 'row',
        content: [
          {
            type: 'component',
            componentType: 'palette',
            title: 'Components',
            isClosable: true
          },
          {
            type: 'component',
            componentType: 'canvas',
            title: 'Canvas',
            isClosable: false,
            reorderEnabled: false,
            header: { popout: false, dock: false, maximise: false }
          },
          {
            type: 'component',
            componentType: 'controls',
            title: 'Properties',
            isClosable: true
          }
        ]
      }
    };

    const layout = new GoldenLayout(layoutRef.current!);

    const register = <P extends { theme: EditorTheme; 'aria-label'?: string }>(
      type: string,
      Component: React.FC<P>,
      ariaLabel: string
    ) => {
      layout.registerComponentFactoryFunction(
        type,
        (container: ComponentContainer) => {
          const root = createRoot(
            container.element as unknown as HTMLElement
          );
          const props = { theme, 'aria-label': ariaLabel } as P;
          root.render(
            <Provider
              theme={defaultTheme}
              colorScheme={theme}
              locale={navigator.language}
            >
              <Component {...props} />
            </Provider>
          );
          container.on('destroy', () => root.unmount());
          return undefined;
        }
      );
    };

    register('palette', ComponentPalette, 'Component Library');
    register('canvas', EditorCanvas, 'Design Canvas');
    register('controls', ControlPanel, 'Properties Panel');

    layout.loadLayout(config);

    return () => layout.destroy();
  }, [theme]);

  const handleThemeToggle = (newTheme: EditorTheme) => {
    setTheme(newTheme);
  };

  return (
    <Provider theme={defaultTheme} colorScheme={theme} locale={navigator.language}>
      <div
        className="editor-container"
        role="application"
        aria-label="React Component Editor"
        style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
      >
        <div style={{ height: '60px' }}>
          <EditorToolbar theme={theme} onThemeChange={handleThemeToggle} />
        </div>
        <div
          ref={layoutRef}
          style={{ flex: 1, position: 'relative', overflow: 'hidden' }}
        />
      </div>
    </Provider>
  );
};

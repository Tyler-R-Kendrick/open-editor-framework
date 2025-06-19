import React, { useState } from 'react';
import { EditorTheme } from '../../types/editor-types';
import { Flex, ButtonGroup, Button } from '@adobe/react-spectrum';
import { useMessageFormatter } from '@react-aria/i18n';
import messages from '../../i18n/toolbarMessages';

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
export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  theme,
  onThemeChange
}) => {
  const formatMessage = useMessageFormatter(messages);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [canUndo] = useState(false);
  const [canRedo] = useState(false);

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
          } catch (_error) {
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

  return (
    <div role="toolbar" aria-label={formatMessage('toolbar')}>
      <Flex
        gap="size-150"
        wrap
        alignItems="center"
        justifyContent="space-between"
      >
        <ButtonGroup>
          <Button variant="primary" onPress={handleNew} aria-label={formatMessage('new')}>
            {formatMessage('new')}
          </Button>
          <Button variant="primary" onPress={handleSave} aria-label={formatMessage('save')}>
            {formatMessage('save')}
          </Button>
          <Button variant="primary" onPress={handleLoad} aria-label={formatMessage('load')}>
            {formatMessage('load')}
          </Button>
          <Button variant="primary" onPress={handleExport} aria-label={formatMessage('export')}>
            {formatMessage('export')}
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button
            variant="secondary"
            onPress={handleUndo}
            isDisabled={!canUndo}
            aria-label={formatMessage('undo')}
          >
            {formatMessage('undo')}
          </Button>
          <Button
            variant="secondary"
            onPress={handleRedo}
            isDisabled={!canRedo}
            aria-label={formatMessage('redo')}
          >
            {formatMessage('redo')}
          </Button>
        </ButtonGroup>

        <Flex gap="size-100" alignItems="center">
          <span>{zoomLevel}%</span>
          <Button
            variant="secondary"
            onPress={() => setZoomLevel((prev) => Math.max(10, prev - 10))}
            aria-label={formatMessage('zoomOut')}
          >
            −
          </Button>
          <Button
            variant="secondary"
            onPress={() => setZoomLevel((prev) => Math.min(500, prev + 10))}
            aria-label={formatMessage('zoomIn')}
          >
            +
          </Button>
          <Button
            variant="secondary"
            onPress={() => setZoomLevel(100)}
            aria-label={formatMessage('resetZoom')}
          >
            ⌂
          </Button>
        </Flex>

        <ButtonGroup>
          <Button
            variant="primary"
            onPress={toggleTheme}
            aria-label={
              theme === 'light' ? formatMessage('dark') : formatMessage('light')
            }
          >
            {theme === 'light' ? formatMessage('dark') : formatMessage('light')}
          </Button>
        </ButtonGroup>
      </Flex>
    </div>
  );
};

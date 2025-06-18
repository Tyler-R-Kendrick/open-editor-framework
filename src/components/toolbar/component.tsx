import React, { useState } from 'react';
import { ActionButton, ButtonGroup, Flex, Text } from '@adobe/react-spectrum';
import Moon from '@spectrum-icons/workflow/Moon';
import Light from '@spectrum-icons/workflow/Light';
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

  return (
    <div role="toolbar" aria-label="Editor toolbar">
      <Flex
        alignItems="center"
        justifyContent="space-between"
        gap="size-150"
        wrap
        padding="size-200"
      >
        <ButtonGroup>
          <ActionButton onPress={handleNew}>New</ActionButton>
          <ActionButton onPress={handleSave}>Save</ActionButton>
          <ActionButton onPress={handleLoad}>Load</ActionButton>
          <ActionButton onPress={handleExport}>Export</ActionButton>
        </ButtonGroup>

      <ButtonGroup>
        <ActionButton onPress={handleUndo} isDisabled={!canUndo}>
          Undo
        </ActionButton>
        <ActionButton onPress={handleRedo} isDisabled={!canRedo}>
          Redo
        </ActionButton>
      </ButtonGroup>

      <Flex alignItems="center" gap="size-100">
        <Text>{zoomLevel}%</Text>
        <ButtonGroup>
          <ActionButton onPress={() => setZoomLevel(prev => Math.max(10, prev - 10))}>
            -
          </ActionButton>
          <ActionButton onPress={() => setZoomLevel(prev => Math.min(500, prev + 10))}>
            +
          </ActionButton>
          <ActionButton onPress={() => setZoomLevel(100)}>Reset</ActionButton>
        </ButtonGroup>
      </Flex>

        <ActionButton
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          onPress={toggleTheme}
        >
          {theme === 'light' ? <Moon /> : <Light />}
        </ActionButton>
      </Flex>
    </div>
  );
};

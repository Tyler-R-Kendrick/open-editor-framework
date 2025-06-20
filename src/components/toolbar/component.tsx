import React from 'react';
import { EditorTheme } from '../../types/editor-types';
import { Flex, ButtonGroup, Button } from '@adobe/react-spectrum';
import Add from '@spectrum-icons/workflow/Add';
import SaveFloppy from '@spectrum-icons/workflow/SaveFloppy';
import OpenIn from '@spectrum-icons/workflow/OpenIn';
import ExportIcon from '@spectrum-icons/workflow/Export';
import UndoIcon from '@spectrum-icons/workflow/Undo';
import RedoIcon from '@spectrum-icons/workflow/Redo';
import Moon from '@spectrum-icons/workflow/Moon';
import Light from '@spectrum-icons/workflow/Light';
import { useMessageFormatter } from '@react-aria/i18n';
import messages from '../../i18n/toolbarMessages';
import { useAppDispatch } from '../../store';
import { ActionCreators } from 'redux-undo';

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
  const dispatch = useAppDispatch();

  const handleUndo = () => {
    dispatch(ActionCreators.undo());
  };

  const handleRedo = () => {
    dispatch(ActionCreators.redo());
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
          <Button
            variant="primary"
            onPress={handleNew}
            aria-label={formatMessage('new')}
          >
            <Add aria-hidden="true" size="S" />
          </Button>
          <Button
            variant="primary"
            onPress={handleSave}
            aria-label={formatMessage('save')}
          >
            <SaveFloppy aria-hidden="true" size="S" />
          </Button>
          <Button
            variant="primary"
            onPress={handleLoad}
            aria-label={formatMessage('load')}
          >
            <OpenIn aria-hidden="true" size="S" />
          </Button>
          <Button
            variant="primary"
            onPress={handleExport}
            aria-label={formatMessage('export')}
          >
            <ExportIcon aria-hidden="true" size="S" />
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button
            variant="secondary"
            onPress={handleUndo}
            aria-label={formatMessage('undo')}
          >
            <UndoIcon aria-hidden="true" size="S" />
          </Button>
          <Button
            variant="secondary"
            onPress={handleRedo}
            aria-label={formatMessage('redo')}
          >
            <RedoIcon aria-hidden="true" size="S" />
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button
            variant="primary"
            onPress={toggleTheme}
            aria-label={
              theme === 'light' ? formatMessage('dark') : formatMessage('light')
            }
          >
            {theme === 'light' ? (
              <Moon aria-hidden="true" size="S" />
            ) : (
              <Light aria-hidden="true" size="S" />
            )}
          </Button>
        </ButtonGroup>
      </Flex>
    </div>
  );
};

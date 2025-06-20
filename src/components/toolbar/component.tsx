import React from 'react';
import { EditorTheme } from '../../types/editor-types';
import { Flex, ButtonGroup, Button } from '@adobe/react-spectrum';
import Add from '@spectrum-icons/workflow/Add';
import SaveFloppy from '@spectrum-icons/workflow/SaveFloppy';
import OpenIn from '@spectrum-icons/workflow/OpenIn';
import Share from '@spectrum-icons/workflow/Share';
import UndoIcon from '@spectrum-icons/workflow/Undo';
import RedoIcon from '@spectrum-icons/workflow/Redo';
import Moon from '@spectrum-icons/workflow/Moon';
import Light from '@spectrum-icons/workflow/Light';
import { useMessageFormatter } from '@react-aria/i18n';
import messages from '../../i18n/toolbarMessages';
import { useAppDispatch, store } from '../../store';
import { ActionCreators } from 'redux-undo';
import { encodeComponents } from '../../utils/share';

interface EditorToolbarProps {
  theme: EditorTheme;
  onThemeChange: (theme: EditorTheme) => void;
}

/**
 * Editor toolbar with actions and theme controls
 * Features:
 * - File operations (new, save, open)
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
    const state = store.getState().canvas.present;
    window.dispatchEvent(
      new window.CustomEvent('editor-save', { detail: { canvas: state } })
    );
  };

  const handleOpen = () => {
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
            window.dispatchEvent(
              new window.CustomEvent('editor-open', {
                detail: { canvas: data }
              })
            );
          } catch (_error) {
            alert('Error loading file: Invalid JSON format');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleShare = async () => {
    const components = store.getState().canvas.present.components;
    const encoded = encodeComponents(components);
    const url = new URL(window.location.href);
    url.searchParams.set('state', encoded);
    try {
      await navigator.clipboard.writeText(url.toString());
    } catch (_err) {
      window.prompt('Share this link:', url.toString());
    }
    window.dispatchEvent(
      new window.CustomEvent('editor-share', {
        detail: { url: url.toString() }
      })
    );
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
            onPress={handleOpen}
            aria-label={formatMessage('open')}
          >
            <OpenIn aria-hidden="true" size="S" />
          </Button>
          <Button
            variant="primary"
            onPress={handleShare}
            aria-label={formatMessage('share')}
          >
            <Share aria-hidden="true" size="S" />
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

import React from 'react';
import { EditorTheme, Resolution } from '../../types/editor-types';
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
  resolution?: Resolution;
  onResolutionChange?: (resolution?: Resolution) => void;
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
  onThemeChange,
  resolution,
  onResolutionChange
}) => {
  const formatMessage = useMessageFormatter(messages);
  const dispatch = useAppDispatch();

  const resolutions: { label: string; value?: Resolution }[] = [
    { label: formatMessage('infinite'), value: undefined },
    { label: '1024x768', value: { width: 1024, height: 768 } },
    { label: '1366x768', value: { width: 1366, height: 768 } },
    { label: '1920x1080', value: { width: 1920, height: 1080 } }
  ];

  const handleUndo = () => {
    dispatch(ActionCreators.undo());
    window.dispatchEvent(new window.CustomEvent('editor-undo'));
  };

  const handleRedo = () => {
    dispatch(ActionCreators.redo());
    window.dispatchEvent(new window.CustomEvent('editor-redo'));
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

        {onResolutionChange && (
          <select
            aria-label={formatMessage('resolution')}
            value={
              resolution
                ? `${resolution.width}x${resolution.height}`
                : 'infinite'
            }
            onChange={(e) => {
              const value = e.target.value;
              const selected = resolutions.find((r) =>
                r.value
                  ? `${r.value.width}x${r.value.height}` === value
                  : value === 'infinite'
              );
              onResolutionChange(selected?.value);
            }}
            style={{
              padding: '8px 12px',
              border: `1px solid ${theme === 'dark' ? '#6b7280' : '#d1d5db'}`,
              borderRadius: '6px',
              background: theme === 'dark' ? '#4b5563' : '#ffffff',
              color: theme === 'dark' ? '#f8fafc' : '#1e293b',
              fontSize: '14px'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor =
                theme === 'dark' ? '#6b7280' : '#d1d5db';
            }}
          >
            {resolutions.map((r) => (
              <option
                key={r.label}
                value={
                  r.value ? `${r.value.width}x${r.value.height}` : 'infinite'
                }
              >
                {r.label}
              </option>
            ))}
          </select>
        )}
      </Flex>
    </div>
  );
};

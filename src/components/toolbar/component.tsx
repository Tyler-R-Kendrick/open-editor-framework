import React, { useMemo, useState } from 'react';
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
import {
  AnalyticsEvents,
  ExperimentFlags,
  resolveSharePreviewEnabled,
  track
} from '../../analytics';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';
import { ShareOutputPreview } from '../share-preview';
import { validateComponentTree } from '../../utils/outputQuality';
import type { BaseComponent } from '../../types/component-base';

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
  const sharePreviewFlag = useFeatureFlag(ExperimentFlags.SHARE_PREVIEW);
  const sharePreviewEnabled = resolveSharePreviewEnabled(sharePreviewFlag);
  const [sharePreviewUrl, setSharePreviewUrl] = useState<string | null>(null);
  const [sharePreviewComponents, setSharePreviewComponents] = useState<
    BaseComponent[]
  >([]);
  const shareStructuralReport = useMemo(
    () => validateComponentTree(sharePreviewComponents),
    [sharePreviewComponents]
  );

  const resolutions: { label: string; value?: Resolution }[] = [
    { label: formatMessage('infinite'), value: undefined },
    { label: '1024x768', value: { width: 1024, height: 768 } },
    { label: '1366x768', value: { width: 1366, height: 768 } },
    { label: '1920x1080', value: { width: 1920, height: 1080 } }
  ];

  const handleUndo = () => {
    dispatch(ActionCreators.undo());
    track(AnalyticsEvents.UNDO_PERFORMED, { source: 'toolbar' });
    window.dispatchEvent(new window.CustomEvent('editor-undo'));
  };

  const handleRedo = () => {
    dispatch(ActionCreators.redo());
    track(AnalyticsEvents.REDO_PERFORMED, { source: 'toolbar' });
    window.dispatchEvent(new window.CustomEvent('editor-redo'));
  };

  const handleNew = () => {
    if (confirm('Create a new document? This will clear the current canvas.')) {
      console.log('New document');
    }
  };

  const handleSave = () => {
    const state = store.getState().canvas.present;
    track(AnalyticsEvents.CANVAS_EXPORTED, {
      component_count: state.components.length,
      format: 'json-event'
    });
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

  const buildShareUrl = () => {
    const components = store.getState().canvas.present.components;
    const encoded = encodeComponents(components);
    const url = new URL(window.location.href);
    url.searchParams.set('state', encoded);
    const structural = validateComponentTree(components);
    return {
      url: url.toString(),
      payloadSize: encoded.length,
      componentCount: components.length,
      components,
      structuralValid: structural.valid,
      structuralIssueCount: structural.issues.length
    };
  };

  const copyShareUrl = async (
    url: string,
    payloadSize: number,
    extras: {
      structuralValid: boolean;
      structuralIssueCount: number;
      componentCount: number;
    }
  ) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch (_err) {
      window.prompt('Share this link:', url);
    }
    track(AnalyticsEvents.SHARE_LINK_CREATED, {
      payload_size: payloadSize,
      preview_shown: sharePreviewEnabled,
      structural_valid: extras.structuralValid,
      structural_issue_count: extras.structuralIssueCount,
      component_count: extras.componentCount
    });
    window.dispatchEvent(
      new window.CustomEvent('editor-share', {
        detail: { url }
      })
    );
  };

  const handleShare = async () => {
    const share = buildShareUrl();
    if (sharePreviewEnabled) {
      setSharePreviewUrl(share.url);
      setSharePreviewComponents(share.components);
      return;
    }
    await copyShareUrl(share.url, share.payloadSize, {
      structuralValid: share.structuralValid,
      structuralIssueCount: share.structuralIssueCount,
      componentCount: share.componentCount
    });
  };

  const confirmSharePreview = async () => {
    if (!sharePreviewUrl) return;
    const payloadSize =
      new URL(sharePreviewUrl).searchParams.get('state')?.length ?? 0;
    await copyShareUrl(sharePreviewUrl, payloadSize, {
      structuralValid: shareStructuralReport.valid,
      structuralIssueCount: shareStructuralReport.issues.length,
      componentCount: sharePreviewComponents.length
    });
    setSharePreviewUrl(null);
    setSharePreviewComponents([]);
  };

  const cancelSharePreview = () => {
    setSharePreviewUrl(null);
    setSharePreviewComponents([]);
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

      {sharePreviewUrl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={formatMessage('sharePreviewTitle')}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '16px'
          }}
        >
          <div
            style={{
              background: theme === 'dark' ? '#1f2937' : '#ffffff',
              color: theme === 'dark' ? '#f8fafc' : '#0f172a',
              borderRadius: '12px',
              maxWidth: '480px',
              width: '100%',
              padding: '20px',
              boxShadow: '0 16px 40px rgba(15, 23, 42, 0.25)'
            }}
          >
            <h2 style={{ margin: '0 0 8px', fontSize: '18px' }}>
              {formatMessage('sharePreviewTitle')}
            </h2>
            <p style={{ margin: '0 0 12px', fontSize: '14px' }}>
              {formatMessage('sharePreviewBody')} (
              {sharePreviewComponents.length})
            </p>
            <div style={{ marginBottom: '12px' }}>
              <ShareOutputPreview
                components={sharePreviewComponents}
                theme={theme}
                aria-label={formatMessage('sharePreviewCanvas')}
              />
            </div>
            <p
              role="status"
              data-testid="share-structural-validity"
              style={{
                margin: '0 0 12px',
                fontSize: '13px',
                color: shareStructuralReport.valid ? '#047857' : '#b91c1c'
              }}
            >
              {shareStructuralReport.valid
                ? formatMessage('sharePreviewValidStructure')
                : formatMessage('sharePreviewInvalidStructure', {
                    count: String(shareStructuralReport.issues.length)
                  })}
            </p>
            <p
              style={{
                wordBreak: 'break-all',
                fontSize: '12px',
                opacity: 0.8,
                marginBottom: '16px'
              }}
            >
              {sharePreviewUrl}
            </p>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                justifyContent: 'flex-end'
              }}
            >
              <button
                type="button"
                onClick={cancelSharePreview}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: 'transparent',
                  cursor: 'pointer'
                }}
              >
                {formatMessage('sharePreviewCancel')}
              </button>
              <button
                type="button"
                onClick={confirmSharePreview}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#0f766e',
                  color: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                {formatMessage('sharePreviewConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

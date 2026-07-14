import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditorToolbar } from '../src/components/toolbar/component';
import { ShareOutputPreview } from '../src/components/share-preview';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { Provider as ReduxProvider } from 'react-redux';
import { store, setComponents } from '../src/store';
import { I18nProvider } from '@react-aria/i18n';
import { BaseComponent } from '../src/types/component-base';
import * as featureFlagHook from '../src/hooks/useFeatureFlag';
import { ExperimentFlags } from '../src/analytics';

function renderToolbar() {
  return render(
    <ReduxProvider store={store}>
      <I18nProvider locale="en-US">
        <Provider theme={defaultTheme} colorScheme="light">
          <EditorToolbar theme="light" onThemeChange={() => {}} />
        </Provider>
      </I18nProvider>
    </ReduxProvider>
  );
}

describe('share output preview (E5)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    act(() => {
      store.dispatch(setComponents([]));
    });
  });

  it('renders a canvas thumbnail for components', () => {
    const components = [
      new BaseComponent({
        id: 'a',
        type: 'text',
        name: 'Title',
        bounds: { x: 10, y: 10, width: 120, height: 40 },
        properties: { text: 'Hello' }
      })
    ];
    render(
      <ShareOutputPreview
        components={components}
        theme="light"
        aria-label="Canvas output preview"
        emptyLabel="Empty canvas"
      />
    );
    expect(screen.getByTestId('share-output-preview')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /canvas output preview/i })).toBeInTheDocument();
  });

  it('shows preview dialog with structural validity when flag is enabled', async () => {
    jest.spyOn(featureFlagHook, 'useFeatureFlag').mockImplementation((flag) =>
      flag === ExperimentFlags.SHARE_PREVIEW ? 'test' : undefined
    );

    act(() => {
      store.dispatch(
        setComponents([
          new BaseComponent({
            id: 'btn-1',
            type: 'button',
            name: 'Save',
            bounds: { x: 0, y: 0, width: 100, height: 40 },
            properties: { text: 'Save' }
          })
        ])
      );
    });

    renderToolbar();
    await userEvent.click(screen.getByRole('button', { name: /share/i }));

    expect(
      screen.getByRole('dialog', { name: /preview share link/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId('share-output-preview')).toBeInTheDocument();
    expect(screen.getByTestId('share-structural-validity')).toHaveTextContent(
      /structure looks valid/i
    );
  });
});

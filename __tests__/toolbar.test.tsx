import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditorToolbar } from '../src/components/toolbar/component';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../src/store';
import { I18nProvider } from '@react-aria/i18n';

test('renders toolbar', () => {
  render(
    <ReduxProvider store={store}>
      <I18nProvider locale="en-US">
        <Provider theme={defaultTheme} colorScheme="light">
          <EditorToolbar theme="light" onThemeChange={() => {}} />
        </Provider>
      </I18nProvider>
    </ReduxProvider>
  );
  const toolbar = screen.getByRole('toolbar', { name: /editor toolbar/i });
  expect(toolbar).toBeInTheDocument();
});

test('dispatches save event', async () => {
  const listener = jest.fn();
  window.addEventListener('editor-save', listener);
  render(
    <ReduxProvider store={store}>
      <I18nProvider locale="en-US">
        <Provider theme={defaultTheme} colorScheme="light">
          <EditorToolbar theme="light" onThemeChange={() => {}} />
        </Provider>
      </I18nProvider>
    </ReduxProvider>
  );
  await userEvent.click(screen.getByRole('button', { name: /save/i }));
  expect(listener).toHaveBeenCalled();
  window.removeEventListener('editor-save', listener);
});

test('dispatches share event', async () => {
  const listener = jest.fn();
  window.addEventListener('editor-share', listener);
  render(
    <ReduxProvider store={store}>
      <I18nProvider locale="en-US">
        <Provider theme={defaultTheme} colorScheme="light">
          <EditorToolbar theme="light" onThemeChange={() => {}} />
        </Provider>
      </I18nProvider>
    </ReduxProvider>
  );
  await userEvent.click(screen.getByRole('button', { name: /share/i }));
  expect(listener).toHaveBeenCalled();
  window.removeEventListener('editor-share', listener);
});

test('dispatches undo event', async () => {
  const listener = jest.fn();
  window.addEventListener('editor-undo', listener);
  render(
    <ReduxProvider store={store}>
      <I18nProvider locale="en-US">
        <Provider theme={defaultTheme} colorScheme="light">
          <EditorToolbar theme="light" onThemeChange={() => {}} />
        </Provider>
      </I18nProvider>
    </ReduxProvider>
  );
  await userEvent.click(screen.getByRole('button', { name: /undo/i }));
  expect(listener).toHaveBeenCalled();
  window.removeEventListener('editor-undo', listener);
});

test('dispatches redo event', async () => {
  const listener = jest.fn();
  window.addEventListener('editor-redo', listener);
  render(
    <ReduxProvider store={store}>
      <I18nProvider locale="en-US">
        <Provider theme={defaultTheme} colorScheme="light">
          <EditorToolbar theme="light" onThemeChange={() => {}} />
        </Provider>
      </I18nProvider>
    </ReduxProvider>
  );
  await userEvent.click(screen.getByRole('button', { name: /redo/i }));
  expect(listener).toHaveBeenCalled();
  window.removeEventListener('editor-redo', listener);
});

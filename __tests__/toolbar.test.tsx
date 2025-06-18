import React from 'react';
import { render, screen } from '@testing-library/react';
import { EditorToolbar } from '../src/components/toolbar/component';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { I18nProvider } from '@react-aria/i18n';

test('renders toolbar', () => {
  render(
    <I18nProvider locale="en-US">
      <Provider theme={defaultTheme} colorScheme="light">
        <EditorToolbar theme="light" onThemeChange={() => {}} />
      </Provider>
    </I18nProvider>
  );
  const toolbar = screen.getByRole('toolbar', { name: /editor toolbar/i });
  expect(toolbar).toBeInTheDocument();
});

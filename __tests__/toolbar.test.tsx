import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { EditorToolbar } from '../src/components/toolbar/component';

test('renders toolbar', () => {
  render(
    <Provider theme={defaultTheme} colorScheme="light" locale="en-US">
      <EditorToolbar theme="light" onThemeChange={() => {}} />
    </Provider>
  );
  const toolbar = screen.getByRole('toolbar', { name: /editor toolbar/i });
  expect(toolbar).toBeInTheDocument();
});

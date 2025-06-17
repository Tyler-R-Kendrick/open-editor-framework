import React from 'react';
import { render, screen } from '@testing-library/react';
import { EditorToolbar } from '../src/components/toolbar/component';

test('renders toolbar', () => {
  render(<EditorToolbar theme="light" onThemeChange={() => {}} />);
  const toolbar = screen.getByRole('toolbar', { name: /editor toolbar/i });
  expect(toolbar).toBeInTheDocument();
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { EditorCanvas } from '../src/components/editor-canvas/component';

test('renders editor canvas', () => {
  render(<EditorCanvas theme="light" />);
  const canvas = screen.getByRole('img', { name: /design canvas/i });
  expect(canvas).toBeInTheDocument();
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { EditorCanvas } from '../src/components/editor-canvas/component';
import { Provider } from 'react-redux';
import { store } from '../src/store';

test('renders editor canvas', () => {
  render(
    <Provider store={store}>
      <EditorCanvas theme="light" canvasSize="infinite" />
    </Provider>
  );
  const canvas = screen.getByRole('img', { name: /design canvas/i });
  expect(canvas).toBeInTheDocument();
});

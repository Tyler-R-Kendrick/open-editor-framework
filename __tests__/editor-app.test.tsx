import React from 'react';
import { render, screen } from '@testing-library/react';
import { EditorApp } from '../src/components/editor-app/component';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: async () => ({ templates: [], categories: [] }) })
  ) as jest.Mock;
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders the main editor application', () => {
  render(<EditorApp />);
  const app = screen.getByRole('application', { name: /react component editor/i });
  expect(app).toBeInTheDocument();
});

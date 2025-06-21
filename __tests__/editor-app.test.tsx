import React from 'react';
import { render, screen } from '@testing-library/react';
import { EditorApp } from '../src/components/editor-app/component';
import { MemoryRouter } from 'react-router-dom';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: async () => ({ templates: [], categories: [] })
    })
  ) as jest.Mock;
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders the main editor application', async () => {
  render(
    <MemoryRouter>
      <EditorApp />
    </MemoryRouter>
  );
  const app = await screen.findByRole('application', {
    name: /react component editor/i
  });
  expect(app).toBeInTheDocument();
});

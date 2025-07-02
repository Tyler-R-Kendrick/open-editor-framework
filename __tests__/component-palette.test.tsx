import React from 'react';
import { render, screen } from '@testing-library/react';
import { ComponentPalette } from '../src/components/component-palette/component';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: async () => ({ templates: [], categories: ['All'] })
    })
  ) as jest.Mock;
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders component palette container', async () => {
  render(<ComponentPalette theme="light" />);
  const palette = await screen.findByLabelText(/component palette/i);
  expect(palette).toBeInTheDocument();
});

test('shows default components when fetch fails', async () => {
  (fetch as jest.Mock).mockRejectedValue(new Error('network'));
  render(<ComponentPalette theme="light" />);
  const items = await screen.findAllByText(/Label/i);
  expect(items.length).toBeGreaterThan(0);
});

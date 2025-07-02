import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentPalette } from '../src/components/component-palette/component';
import { Provider as ReduxProvider } from 'react-redux';
import { store, setComponents } from '../src/store';
import { defaultComponentTemplates } from '../src/samples/defaultComponentTemplates';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: async () => ({
        templates: defaultComponentTemplates.templates,
        categories: defaultComponentTemplates.categories
      })
    })
  ) as jest.Mock;
});

afterEach(() => {
  jest.resetAllMocks();
  store.dispatch(setComponents([]));
});

test('renders component palette container', async () => {
  render(
    <ReduxProvider store={store}>
      <ComponentPalette theme="light" />
    </ReduxProvider>
  );
  const palette = await screen.findByLabelText(/component palette/i);
  expect(palette).toBeInTheDocument();
});

test('shows default components when fetch fails', async () => {
  (fetch as jest.Mock).mockRejectedValue(new Error('network'));
  render(
    <ReduxProvider store={store}>
      <ComponentPalette theme="light" />
    </ReduxProvider>
  );
  const items = await screen.findAllByText(/Label/i);
  expect(items.length).toBeGreaterThan(0);
});

test('adds component to store on click', async () => {
  render(
    <ReduxProvider store={store}>
      <ComponentPalette theme="light" />
    </ReduxProvider>
  );

  const button = await screen.findByText('Button');
  await userEvent.click(button);

  expect(store.getState().canvas.present.components.length).toBe(1);
});

test('mobile tap adds component', async () => {
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: query.includes('max-width'),
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  }));

  render(
    <ReduxProvider store={store}>
      <ComponentPalette theme="light" />
    </ReduxProvider>
  );

  const label = await screen.findByText('Label');
  await userEvent.click(label);

  expect(store.getState().canvas.present.components.length).toBe(1);
});

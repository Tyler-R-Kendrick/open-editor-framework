import React from 'react';
import { render, screen } from '@testing-library/react';
import { ControlPanel } from '../src/components/control-panel/component';

test('renders control panel container', () => {
  render(<ControlPanel theme="light" />);
  const panel = screen.getByLabelText(/properties panel/i);
  expect(panel).toBeInTheDocument();
});

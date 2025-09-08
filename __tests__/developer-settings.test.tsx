import { render, screen, fireEvent } from '@testing-library/react';
import DeveloperSettings from '../src/components/developer-settings';

describe('DeveloperSettings', () => {
  it('allows editing environment variables', () => {
    render(<DeveloperSettings initialEnv={{ FOO: 'bar' }} />);
    const input = screen.getByLabelText('FOO');
    expect(input).toHaveValue('bar');
    fireEvent.change(input, { target: { value: 'baz' } });
    expect(input).toHaveValue('baz');
  });
});

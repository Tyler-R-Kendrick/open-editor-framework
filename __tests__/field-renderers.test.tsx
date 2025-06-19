import React from 'react';
import { render } from '@testing-library/react';
import {
  TextFieldRenderer,
  NumberFieldRenderer,
  ColorFieldRenderer,
  SelectFieldRenderer
} from '../src/components/control-panel/field-renderers';

// Mock property for testing
const mockProperty = {
  key: 'test',
  value: 'test value',
  options: ['option1', 'option2']
};

const mockOnChange = jest.fn();

describe('Field Renderers', () => {
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('should render TextFieldRenderer with consistent styling for light theme', () => {
    const { container } = render(
      <TextFieldRenderer property={mockProperty} theme="light" onChange={mockOnChange} />
    );
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input).toHaveStyle({
      width: '100%',
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '14px'
    });
  });

  it('should render TextFieldRenderer with consistent styling for dark theme', () => {
    const { container } = render(
      <TextFieldRenderer property={mockProperty} theme="dark" onChange={mockOnChange} />
    );
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input).toHaveStyle({
      width: '100%',
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '14px'
    });
  });

  it('should render NumberFieldRenderer with consistent styling', () => {
    const { container } = render(
      <NumberFieldRenderer property={{ ...mockProperty, value: 42 }} theme="light" onChange={mockOnChange} />
    );
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input).toHaveStyle({
      width: '100%',
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '14px'
    });
  });

  it('should render ColorFieldRenderer with consistent styling', () => {
    const { container } = render(
      <ColorFieldRenderer property={{ ...mockProperty, value: '#ff0000' }} theme="light" onChange={mockOnChange} />
    );
    const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;
    expect(textInput).toHaveStyle({
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '14px'
    });
  });

  it('should render SelectFieldRenderer with consistent styling', () => {
    const { container } = render(
      <SelectFieldRenderer property={mockProperty} theme="light" onChange={mockOnChange} />
    );
    const select = container.querySelector('select');
    expect(select).toHaveStyle({
      width: '100%',
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '14px'
    });
  });
});

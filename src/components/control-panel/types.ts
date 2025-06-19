import React from 'react';
import { ComponentPropertyValue } from '../../types/component-base';
import { EditorTheme } from '../../types/editor-types';

export interface PropertyField {
  key: string;
  label: string;
  type: string; // Generic string instead of union type
  value: ComponentPropertyValue;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

export interface PropertySection {
  title: string;
  fields: string[];
}

export interface FieldRendererProps {
  property: PropertyField;
  theme: EditorTheme;
  onChange: (key: string, value: ComponentPropertyValue) => void;
}

export type FieldRenderer = React.ComponentType<FieldRendererProps>;

// Generic field renderer map - accepts any string key
export interface FieldRendererMap {
  [fieldType: string]: FieldRenderer;
}

// Built-in field types for convenience and type safety
export type BuiltInFieldType = 'text' | 'number' | 'color' | 'select' | 'checkbox' | 'range';

// Specific map for built-in field types
export interface BuiltInFieldRendererMap {
  text?: FieldRenderer;
  number?: FieldRenderer;
  color?: FieldRenderer;
  select?: FieldRenderer;
  checkbox?: FieldRenderer;
  range?: FieldRenderer;
}

export interface ControlPanelConfig {
  fieldRenderers?: FieldRendererMap;
  sections?: PropertySection[];
}

import { PropertySection } from './types';

export const defaultSections: PropertySection[] = [
  {
    title: 'Content',
    fields: ['text', 'fontSize', 'fontFamily', 'color']
  },
  {
    title: 'Appearance',
    fields: ['backgroundColor', 'borderRadius', 'opacity']
  },
  {
    title: 'Visibility',
    fields: ['visible']
  }
];

export const getDefaultConfig = () => ({
  sections: defaultSections
});

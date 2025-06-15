import { useState, useEffect } from 'react';

export interface ComponentTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  template: {
    type: string;
    defaultSize: { width: number; height: number };
    properties: Record<string, any>;
  };
}

export interface ComponentTemplatesData {
  templates: ComponentTemplate[];
  categories: string[];
}

interface UseComponentTemplatesResult {
  templates: ComponentTemplate[];
  categories: string[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

// Default fallback templates in case loading fails
const defaultTemplates: ComponentTemplate[] = [
  {
    id: 'text',
    name: 'Text',
    icon: '📝',
    description: 'Text component for labels and content',
    category: 'Basic',
    template: {
      type: 'text',
      defaultSize: { width: 200, height: 40 },
      properties: {
        text: 'Sample Text',
        fontSize: 16,
        fontFamily: 'Arial',
        color: '#000000'
      }
    }
  },
  {
    id: 'button',
    name: 'Button',
    icon: '🔘',
    description: 'Interactive button component',
    category: 'Basic',
    template: {
      type: 'button',
      defaultSize: { width: 120, height: 40 },
      properties: {
        text: 'Button',
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        borderRadius: 6
      }
    }
  }
];

const defaultCategories = ['All', 'Basic', 'Layout', 'Form', 'Media'];

/**
 * Custom hook to load component templates from an external JSON file
 * Falls back to default templates if loading fails
 * 
 * @param templateUrl - URL to the JSON file containing templates (defaults to public assets)
 * @returns Object containing templates, categories, loading state, error state, and reload function
 */
export const useComponentTemplates = (
  templateUrl: string = '/assets/component-templates.json'
): UseComponentTemplatesResult => {
  const [templates, setTemplates] = useState<ComponentTemplate[]>(defaultTemplates);
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(templateUrl);

      if (!response.ok) {
        throw new Error(`Failed to load templates: ${response.status} ${response.statusText}`);
      }

      const data: ComponentTemplatesData = await response.json();

      // Validate the loaded data structure
      if (!data.templates || !Array.isArray(data.templates)) {
        throw new Error('Invalid templates data structure: missing or invalid templates array');
      }

      if (!data.categories || !Array.isArray(data.categories)) {
        throw new Error('Invalid templates data structure: missing or invalid categories array');
      }

      // Validate each template has required fields
      for (const template of data.templates) {
        if (!template.id || !template.name || !template.template) {
          throw new Error(`Invalid template structure: template missing required fields (id, name, template)`);
        }
      }

      setTemplates(data.templates);
      setCategories(data.categories);
    } catch (err) {
      console.warn('Failed to load external component templates, using defaults:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      // Keep using default templates on error
      setTemplates(defaultTemplates);
      setCategories(defaultCategories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, [templateUrl]);

  const reload = () => {
    loadTemplates();
  };

  return {
    templates,
    categories,
    loading,
    error,
    reload
  };
};

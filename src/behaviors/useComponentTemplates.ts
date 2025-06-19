import { useState, useEffect, useCallback } from 'react';
import {
  MarketplaceComponent,
  MarketplaceComponentOptions
} from '../types/component-base';

export interface ComponentTemplatesData {
  templates: MarketplaceComponentOptions[];
  categories: string[];
}

interface UseComponentTemplatesResult {
  templates: MarketplaceComponent[];
  categories: string[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Custom hook to load component templates from an external JSON file
 * Loads component templates from the provided URL
 *
 * @param templateUrl - URL to the JSON file containing templates (defaults to public assets)
 * @returns Object containing templates, categories, loading state, error state, and reload function
 */
export const useComponentTemplates = (
  templateUrl: string = '/assets/component-templates.json'
): UseComponentTemplatesResult => {
  const [templates, setTemplates] = useState<MarketplaceComponent[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(templateUrl);

      if (!response.ok) {
        throw new Error(
          `Failed to load templates: ${response.status} ${response.statusText}`
        );
      }

      const data: ComponentTemplatesData = await response.json();

      // Validate the loaded data structure
      if (!data.templates || !Array.isArray(data.templates)) {
        throw new Error(
          'Invalid templates data structure: missing or invalid templates array'
        );
      }

      if (!data.categories || !Array.isArray(data.categories)) {
        throw new Error(
          'Invalid templates data structure: missing or invalid categories array'
        );
      }

      // Validate each template has required fields
      for (const template of data.templates) {
        if (!template.id || !template.name || !template.type) {
          throw new Error(
            `Invalid template structure: template missing required fields (id, name, type)`
          );
        }
      }

      const mapped = data.templates.map((t) => new MarketplaceComponent(t));
      setTemplates(mapped);
      setCategories(data.categories);
    } catch (err) {
      console.warn('Failed to load external component templates:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setTemplates([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [templateUrl]);

  // Load templates on initial mount or when the template URL changes
  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

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

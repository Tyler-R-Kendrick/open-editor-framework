# External Template Loading - Usage Examples

This document demonstrates how to use the new external template loading functionality in the Component Palette.

## Overview

The Component Palette now supports loading component templates from external JSON files, allowing for:
- Dynamic component libraries
- Custom template sets for different projects
- Easy updates without code changes
- Fallback to default templates if loading fails

## Basic Usage

### Default Templates
```tsx
import { ComponentPalette } from './components/component-palette';

// Loads from /assets/component-templates.json by default
<ComponentPalette theme="light" />
```

### Custom Template URL
```tsx
// Load from a custom URL
<ComponentPalette 
  theme="dark" 
  templateUrl="/assets/extended-templates.json"
/>

// Load from an API endpoint
<ComponentPalette 
  theme="light" 
  templateUrl="/api/v1/templates"
/>

// Load from a different domain (CORS must be configured)
<ComponentPalette 
  theme="light" 
  templateUrl="https://cdn.example.com/templates.json"
/>
```

## Template JSON Structure

### Required Format
```json
{
  "templates": [
    {
      "id": "unique-component-id",
      "name": "Display Name",
      "icon": "📝", 
      "description": "Component description",
      "category": "Category Name",
      "template": {
        "type": "component-type",
        "defaultSize": { "width": 200, "height": 40 },
        "properties": {
          "property1": "value1",
          "property2": "value2"
        }
      }
    }
  ],
  "categories": ["All", "Category1", "Category2"]
}
```

### Field Descriptions

- **id**: Unique identifier (required)
- **name**: Human-readable component name (required)
- **icon**: Unicode emoji or icon character (required)
- **description**: Brief component description (required)
- **category**: Must match one of the categories (required)
- **template**: Component definition object (required)
  - **type**: Component type identifier (required)
  - **defaultSize**: Default dimensions (required)
  - **properties**: Component-specific properties (required)

## Example Templates

### Basic Text Component
```json
{
  "id": "text",
  "name": "Text",
  "icon": "📝",
  "description": "Text component for labels and content",
  "category": "Basic",
  "template": {
    "type": "text",
    "defaultSize": { "width": 200, "height": 40 },
    "properties": {
      "text": "Sample Text",
      "fontSize": 16,
      "fontFamily": "Arial",
      "color": "#000000"
    }
  }
}
```

### Advanced Chart Component
```json
{
  "id": "chart",
  "name": "Chart",
  "icon": "📊",
  "description": "Data visualization chart",
  "category": "Data",
  "template": {
    "type": "chart",
    "defaultSize": { "width": 400, "height": 300 },
    "properties": {
      "chartType": "bar",
      "data": [],
      "title": "Chart Title",
      "showLegend": true,
      "colors": ["#3b82f6", "#ef4444", "#10b981"]
    }
  }
}
```

## Using the Hook Directly

For custom implementations, you can use the `useComponentTemplates` hook directly:

```tsx
import { useComponentTemplates } from './behaviors/useComponentTemplates';

function CustomComponentPalette() {
  const { 
    templates, 
    categories, 
    loading, 
    error, 
    reload 
  } = useComponentTemplates('/my-custom-templates.json');

  if (loading) return <div>Loading templates...</div>;
  
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={reload}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Custom Template Library</h2>
      {templates.map(template => (
        <div key={template.id}>
          {template.icon} {template.name}
        </div>
      ))}
    </div>
  );
}
```

## Error Handling

The component includes robust error handling:

### Network Errors
```json
// If the URL is unreachable
{
  "error": "Failed to load templates: 404 Not Found"
}
```

### JSON Validation Errors
```json
// If required fields are missing
{
  "error": "Invalid template structure: template missing required fields (id, name, template)"
}
```

### Fallback Behavior
- Always falls back to built-in default templates
- Shows error message with retry button
- Continues to function normally with defaults

## Best Practices

### Template Organization
```json
{
  "templates": [
    // Group by category
    // Basic components first
    { "category": "Basic", ... },
    
    // Layout components
    { "category": "Layout", ... },
    
    // Specialized components last
    { "category": "Advanced", ... }
  ],
  "categories": [
    "All",
    "Basic",
    "Layout", 
    "Form",
    "Media",
    "Advanced"
  ]
}
```

### Template Properties
```json
{
  "template": {
    "type": "button",
    "defaultSize": { "width": 120, "height": 40 },
    "properties": {
      // Always provide sensible defaults
      "text": "Button",
      "backgroundColor": "#3b82f6",
      "color": "#ffffff",
      "borderRadius": 6,
      
      // Include common customization options
      "disabled": false,
      "loading": false,
      "variant": "primary"
    }
  }
}
```

### Performance Considerations
- Keep JSON files reasonably sized (< 1MB recommended)
- Use CDN for template files in production
- Consider caching strategies for frequently accessed templates
- Minimize template property objects

## Deployment

### Static Files
Place JSON files in `public/assets/` for static hosting:
```
public/
  assets/
    component-templates.json      (default)
    extended-templates.json       (example)
    custom-theme-templates.json   (themed)
```

### API Endpoints
For dynamic templates, create API endpoints:
```javascript
// Express.js example
app.get('/api/templates/:theme', (req, res) => {
  const templates = loadTemplatesForTheme(req.params.theme);
  res.json(templates);
});
```

### Content Delivery Network
For production, use a CDN:
```tsx
<ComponentPalette 
  templateUrl="https://cdn.mysite.com/templates/v1/components.json"
/>
```

## Migration from Hard-coded Templates

To migrate existing hard-coded templates:

1. Extract current templates to JSON format
2. Test with the new component
3. Update component usage to include `templateUrl`
4. Remove old hard-coded template arrays

## Troubleshooting

### Common Issues

**Templates not loading**
- Check network tab for 404 errors
- Verify JSON syntax with a validator
- Ensure CORS is configured for cross-domain requests

**Categories not showing**
- Verify `categories` array is present in JSON
- Ensure template categories match category names exactly

**Components not draggable**
- Check that `template` object has required `type` field
- Verify `defaultSize` is properly formatted

### Debug Mode
```tsx
// Enable console logging for debugging
const { templates, loading, error } = useComponentTemplates(url);

console.log('Templates:', templates);
console.log('Loading:', loading); 
console.log('Error:', error);
```

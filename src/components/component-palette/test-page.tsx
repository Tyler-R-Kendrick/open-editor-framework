import { useComponentTemplates } from '../behaviors/useComponentTemplates';

/**
 * Simple test component to verify the external template loading functionality
 */
export const ComponentPaletteTestPage: React.FC = () => {
  const { templates, categories, loading, error, reload } = useComponentTemplates();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Component Template Loading Test</h1>

      <div style={{ marginBottom: '20px' }}>
        <h2>Status</h2>
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
        <p>Error: {error || 'None'}</p>
        <p>Templates loaded: {templates.length}</p>
        <p>Categories: {categories.join(', ')}</p>

        {error && (
          <button
            onClick={reload}
            style={{
              padding: '8px 16px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry Loading
          </button>
        )}
      </div>

      <div>
        <h2>Loaded Templates</h2>
        {templates.map(template => (
          <div
            key={template.id}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              margin: '10px 0',
              borderRadius: '4px'
            }}
          >
            <h3>{template.icon} {template.name}</h3>
            <p><strong>Category:</strong> {template.category}</p>
            <p><strong>Description:</strong> {template.description}</p>
            <details>
              <summary>Template Details</summary>
              <pre style={{ background: '#f5f5f5', padding: '10px' }}>
                {JSON.stringify(template.template, null, 2)}
              </pre>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
};

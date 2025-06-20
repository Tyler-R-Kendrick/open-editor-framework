# ButtonToggle Component

A reusable toggle button component with theme-aware styling and accessibility support.

## Features

- **Theme-aware styling**: Automatic color adaptation for dark/light themes
- **Toggle state management**: Visual feedback for active/inactive states  
- **Accessibility**: Proper ARIA attributes and keyboard navigation
- **Touch-optimized**: Minimum 44px touch targets for mobile devices
- **Smooth transitions**: Responsive hover and state change animations

## Usage

```tsx
import { ButtonToggle } from './components/button-toggle';
import { EditorTheme } from './types/editor-types';

function MyComponent() {
  const [isEnabled, setIsEnabled] = useState(false);
  const theme: EditorTheme = 'light';

  return (
    <ButtonToggle
      isActive={isEnabled}
      onToggle={() => setIsEnabled(!isEnabled)}
      theme={theme}
      aria-label="Toggle feature"
    >
      {isEnabled ? '✓ Enabled' : '✗ Disabled'}
    </ButtonToggle>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isActive` | `boolean` | Yes | Whether the toggle is currently active/pressed |
| `onToggle` | `() => void` | Yes | Function called when toggle is clicked |
| `theme` | `EditorTheme` | Yes | Theme for styling ('light' or 'dark') |
| `children` | `React.ReactNode` | Yes | Content to display inside the button |
| `aria-label` | `string` | Yes | Accessible label for the button |
| `className` | `string` | No | Additional CSS class name |
| `disabled` | `boolean` | No | Whether the button is disabled (default: false) |

## Styling

The component uses theme-aware colors:

**Light Theme:**
- Active: Green background (#22c55e) with white text
- Inactive: Light gray background (#d1d5db) with dark text (#374151)

**Dark Theme:**  
- Active: Green background (#10b981) with white text
- Inactive: Dark gray background (#6b7280) with light text (#d1d5db)

## Accessibility

- Uses `aria-pressed` to indicate toggle state
- Supports keyboard navigation (Enter and Space keys)
- Provides proper focus indicators
- Maintains minimum 44px touch targets
- Respects disabled state with visual and interaction feedback

## Replacing Existing Toggle Buttons

This component can replace inline toggle button implementations:

**Before:**
```tsx
<button
  onClick={() => onChange(property.key, !property.value)}
  style={{
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    background: property.value 
      ? (theme === 'dark' ? '#10b981' : '#22c55e')
      : (theme === 'dark' ? '#6b7280' : '#d1d5db'),
    color: property.value ? '#ffffff' : (theme === 'dark' ? '#d1d5db' : '#374151'),
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }}
>
  {property.value ? '✓ Enabled' : '✗ Disabled'}
</button>
```

**After:**
```tsx
<ButtonToggle
  isActive={property.value}
  onToggle={() => onChange(property.key, !property.value)}
  theme={theme}
  aria-label={`Toggle ${property.key}`}
>
  {property.value ? '✓ Enabled' : '✗ Disabled'}
</ButtonToggle>
```

## Related Components

- Use with control panel field renderers for consistent toggle styling
- Can be combined with other form components for complex interfaces
- Integrates well with the existing theme system
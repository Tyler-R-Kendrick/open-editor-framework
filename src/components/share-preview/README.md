# ShareOutputPreview

Renders a static canvas thumbnail of the current component tree for the E5
share-link output preview experiment.

## Features

- Draws component bounds, fill, border, and a short label into an HTML canvas
- Scales content to fit the preview while preserving aspect ratio
- Uses `role="img"` with a localized `aria-label`

## Usage

```tsx
import { ShareOutputPreview } from '../share-preview';

<ShareOutputPreview
  components={components}
  theme={theme}
  aria-label="Canvas output preview"
/>;
```

## Accessibility

- Exposed as an image landmark via `role="img"`
- Callers must supply a meaningful `aria-label`
- Preview is informational; share confirm/cancel remain keyboard-reachable
  buttons in the toolbar dialog

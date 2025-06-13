# End-to-End Testing with Playwright

This directory contains comprehensive end-to-end tests for the Open Editor Framework using Playwright.

## Test Structure

### Core Component Tests
- `editor-app.spec.ts` - Main application component tests
- `toolbar.spec.ts` - Toolbar functionality and accessibility
- `canvas.spec.ts` - Canvas drag-and-drop and interactions
- `component-palette.spec.ts` - Component palette functionality
- `control-panel.spec.ts` - Property controls and form validation

### Specialized Test Suites
- `accessibility.spec.ts` - Comprehensive accessibility testing (WCAG compliance)
- `mobile-touch.spec.ts` - Touch interactions and mobile responsiveness
- `performance.spec.ts` - Performance metrics and optimization validation
- `integration.spec.ts` - Full workflow integration tests using utility functions

### Utilities
- `utils/test-helpers.ts` - Reusable utility functions for common testing scenarios

## Running Tests

### Local Development
```bash
# Run all tests
npm run test:e2e

# Run tests with UI (interactive mode)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Debug tests step by step
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

### Running Specific Tests
```bash
# Run specific test file
npx playwright test editor-app.spec.ts

# Run tests matching a pattern
npx playwright test --grep "accessibility"

# Run tests for specific browser
npx playwright test --project=chromium
```

## Test Coverage

### Functionality Testing
- ✅ Component loading and rendering
- ✅ Drag and drop interactions
- ✅ Form controls and validation
- ✅ Button clicks and navigation
- ✅ Responsive layout behavior

### Accessibility Testing
- ✅ ARIA compliance
- ✅ Keyboard navigation
- ✅ Screen reader compatibility
- ✅ Focus management
- ✅ Color contrast validation
- ✅ Semantic HTML structure

### Mobile & Touch Testing
- ✅ Touch gestures (tap, drag, pinch, swipe)
- ✅ Mobile viewport adaptation
- ✅ Touch-friendly sizing
- ✅ Responsive breakpoints
- ✅ Touch-action CSS properties

### Performance Testing
- ✅ Load time validation
- ✅ Interaction responsiveness
- ✅ Memory usage monitoring
- ✅ Animation smoothness
- ✅ Large dataset handling

## Browser Support

Tests run against:
- **Chromium** (Desktop Chrome)
- **Firefox** (Desktop Firefox)
- **WebKit** (Desktop Safari)
- **Mobile Chrome** (Pixel 5 simulation)
- **Mobile Safari** (iPhone 12 simulation)

## Configuration

The Playwright configuration is in `playwright.config.ts`:
- Automatic server startup (`npm run dev`)
- Screenshot on failure
- Video recording on failure
- Trace collection for debugging
- Parallel test execution
- CI-optimized settings

## Continuous Integration

GitHub Actions workflow (`.github/workflows/playwright.yml`) runs tests on:
- Push to main/develop branches
- Pull requests to main
- Artifacts saved for 30 days

## Writing New Tests

### Best Practices

1. **Use the utility functions** in `utils/test-helpers.ts` for common operations
2. **Wait for web components** to be defined before interacting
3. **Test accessibility** as a first-class concern
4. **Include mobile/touch scenarios** for interactive elements
5. **Verify performance** for user-facing features

### Example Test Structure
```typescript
import { test, expect } from '@playwright/test';
import { waitForWebComponents, checkAccessibility } from './utils/test-helpers';

test.describe('New Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForWebComponents(page, ['my-component']);
  });

  test('should work correctly', async ({ page }) => {
    const component = page.locator('my-component');
    await expect(component).toBeVisible();
    
    // Test functionality
    await component.click();
    
    // Test accessibility
    const accessibility = await checkAccessibility(component);
    expect(accessibility.hasLabel).toBeTruthy();
  });
});
```

### Mobile-First Testing
Always include mobile variants:
```typescript
test('should work on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  // ... mobile-specific tests
});
```

## Debugging Tests

### Visual Debugging
```bash
# Open Playwright Test Generator
npx playwright codegen localhost:3000

# Debug specific test
npx playwright test --debug canvas.spec.ts
```

### Trace Analysis
When tests fail, check the trace files in `test-results/` or use:
```bash
npx playwright show-trace test-results/trace.zip
```

## Common Issues

### Component Not Found
- Ensure web components are properly defined
- Use `waitForWebComponents()` utility
- Check for timing issues with dynamic content

### Drag and Drop Failures
- Use the provided `dragAndDrop()` utility
- Ensure elements have proper bounding boxes
- Add delays for animations

### Mobile Test Issues
- Set viewport size before navigation
- Use touch-specific utilities for interactions
- Test with actual touch events, not just mouse simulation

### Performance Test Flakiness
- Use relative performance metrics, not absolute values
- Account for CI environment differences
- Test performance patterns, not exact numbers

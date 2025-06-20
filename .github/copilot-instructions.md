---
applyTo: '**/*.tsx'
---
# Copilot Instructions for React Components

Coding standards, domain knowledge, and preferences that AI should follow.

## React Component Standards

- Use TypeScript for all React component code.
- Use functional components with hooks instead of class components.
- Use React 18+ features and patterns.
- Use Tailwind CSS for styling when possible, or inline styles for dynamic theming.
- Make sure to support mobile and desktop interactions; especially for drag-and-drop, resizing, touch-and-hold, etc...
- Ensure components are accessible and follow WAI-ARIA standards at a minimum.
- Keep components small and focused on a single responsibility.

### Structure

- Use a modular structure with components in separate files.
- Give each component its own directory.
- Put component logic and markup in a "component.tsx" file.
- Use a `README.md` file in each component directory to document usage and API.
- Make each component self-contained with its own styles and logic.
- Use TypeScript interfaces for prop definitions.
- Use descriptive names for components, interfaces, and files.
- Make components compatible with Storybook (CSF3 format).
- Install and use Storybook if it's not already installed.

### Component Patterns

- Use React.FC type for functional components.
- Define prop interfaces with clear names ending in "Props".
- Use React hooks (useState, useEffect, useCallback, useMemo) appropriately.
- Handle cleanup in useEffect return functions.
- Use proper dependency arrays for hooks.
- Implement proper TypeScript typing for all props and state.

## Component Behaviors

- Store shared behaviors in a "behaviors" directory as a sibling to "components".
- Use custom hooks to encapsulate common functionality like drag-and-drop, resizing, etc.
- Create reusable hooks for complex state management.

## Tests

- Use Playwright for end-to-end testing.
- Write tests for all components using React Testing Library.
- Ensure tests cover both mobile and desktop interactions.
- Use Playwright's built-in accessibility checks.
- Test component props, events, and user interactions.
- When your changes may alter how components render, run `npm run test:e2e` and review the Playwright report for visual changes.


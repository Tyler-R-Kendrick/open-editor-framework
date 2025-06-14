---
applyTo: '**/*.ts'
---
# Copilot Instructions for TypeScript Web Components

Coding standards, domain knowledge, and preferences that AI should follow.

## Web Component Standards

- Use TypeScript for all web component code.
- Use lit for building web components.
- Use Tailwind CSS for styling.
- Make sure to support mobile and desktop interactions; especially for drag-and-drop, resizing, touch-and-hold, etc...
- Ensure components are accessible and follow WAI-ARIA standards at a minimum.
- Keep components small and focused on a single responsibility.

### Structure
- Use a modular structure with components in separate files.
- Give each component its own directory.
- put component logic, markup, and styles in the same "component.ts" file.
- Use a `README.md` file in each component directory to document usage and API.
- Make each component self-contained with its own styles and logic.
- Use descriptive names for components, styles, and files.
- Make them compatible with CSF3 (Component Story Format 3) for Storybook.
- Install and use storybook if its not already installed.

## Tests

- Use Playwright for end-to-end testing.
- Write tests for all components
- Ensure tests cover both mobile and desktop interactions.
- Use Playwright's built-in accessibility checks.


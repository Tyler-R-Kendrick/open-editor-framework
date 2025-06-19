# Codex Agent Instructions for open-editor-framework

These instructions outline patterns and practices to follow when working with this repository.

## Development Workflow

1. **Node Version**: Use Node.js 22+ and npm 11+.
2. **Install Dependencies**: run `npm install` from the repository root.
3. **Stay Up to Date**: before starting new work pull the latest changes with
   `git fetch --all` and `git pull --rebase`. Resolve merge conflicts if they
   arise so your branch stays current.
4. **Code Formatting**: format code with `npm run format`. The project uses Prettier with the configuration in `.prettierrc`.
5. **Linting**: run `npm run lint` before committing. Fix any reported issues.
6. **Type Checking**: ensure `npm run type-check` passes.
7. **Testing**: run `npm run test` and ensure all tests pass.
8. **Build Tokens**: if you modify design tokens, run `npm run build:tokens` to regenerate `src/styles/tokens.css`.
9. **Commit Messages**: use [Conventional Commits](https://www.conventionalcommits.org/) such as `feat:`, `fix:`, `docs:`, etc.

## Project Structure

- `src/components/<name>` – React component folders. Each should contain:
  - `component.tsx` – the component implementation
  - `index.ts` – barrel export
  - `README.md` – documentation describing features, usage, accessibility notes
  - `*.stories.tsx` – optional Storybook stories
- `src/styles` – global CSS and generated token styles
- `__tests__` – Jest tests using React Testing Library

## Coding Guidelines

- All source files are TypeScript (`.ts` or `.tsx`).
- Follow the existing patterns for inline styles and accessibility attributes.
- Use design tokens defined in the `tokens/` folder for colors and spacing.
- Keep components accessible: include ARIA labels, keyboard navigation and touch support as demonstrated in existing components.
- Prioritize accessibility and internationalization. Ensure all UI is usable via
  keyboard, screen reader, and touch. Use language keys and locale-aware
  formatting for all user-facing strings.
- Keep unit tests alongside other tests in `__tests__/` and strive for good coverage.

## Pull Requests

- Take a test-driven approach. Start by outlining an **implementation plan**,
  then write failing tests that verify the plan. Implement code in a short
  inner loop until the tests pass.
- Include relevant tests and documentation for new features.
- Do not commit build artifacts (`dist/`) or `node_modules/`.
- Before submitting a PR, ensure linting, formatting, type-check and tests all
  succeed.

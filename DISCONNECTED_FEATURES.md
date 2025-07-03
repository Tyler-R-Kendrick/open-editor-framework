# Disconnected or Unused Features

The repository contains a few modules that are currently unused or only partially integrated:

- `src/components/editor-canvas/useCanvasState.ts` – custom hook intended for canvas state management but not referenced anywhere in the codebase.
- `src/components/editor-canvas/CanvasRenderer.tsx` and `CanvasControls.tsx` – standalone canvas rendering utilities that are not imported by the main editor component.
- `samples/default-renderers.ts` – example canvas renderer map only used in tests.

These files look like future expansion points and are safe to remove or wire up in subsequent development.

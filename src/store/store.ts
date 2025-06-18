import { configureStore } from '@reduxjs/toolkit';
import editorReducer from './editorSlice';
import canvasReducer from './canvasSlice';

export const store = configureStore({
  reducer: {
    editor: editorReducer,
    canvas: canvasReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

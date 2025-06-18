import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EditorTheme } from '../types/editor-types';

export interface EditorUIState {
  theme: EditorTheme;
  isMobile: boolean;
  activeMobileTab: 'palette' | 'canvas' | 'controls';
}

const initialState: EditorUIState = {
  theme: 'light',
  isMobile: false,
  activeMobileTab: 'canvas'
};

const editorSlice = createSlice({
  name: 'editorUI',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<EditorTheme>) {
      state.theme = action.payload;
    },
    setIsMobile(state, action: PayloadAction<boolean>) {
      state.isMobile = action.payload;
    },
    setActiveMobileTab(state, action: PayloadAction<'palette' | 'canvas' | 'controls'>) {
      state.activeMobileTab = action.payload;
    }
  }
});

export const { setTheme, setIsMobile, setActiveMobileTab } = editorSlice.actions;
export default editorSlice.reducer;

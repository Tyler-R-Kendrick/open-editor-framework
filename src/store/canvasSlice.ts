import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CanvasState, EditorComponent, Point } from '../types/editor-types';

type HistoryState = {
  components: EditorComponent[];
  canvasState: CanvasState;
};

export interface CanvasSliceState {
  components: EditorComponent[];
  canvasState: CanvasState;
  past: HistoryState[];
  future: HistoryState[];
}

const initialCanvasState: CanvasState = {
  zoom: 1,
  pan: { x: 0, y: 0 },
  selectedComponents: [],
  clipboard: [],
  history: [],
  historyIndex: -1
};

const initialState: CanvasSliceState = {
  components: [],
  canvasState: initialCanvasState,
  past: [],
  future: []
};

const saveHistory = (state: CanvasSliceState) => {
  state.past.push({
    components: JSON.parse(JSON.stringify(state.components)),
    canvasState: JSON.parse(JSON.stringify(state.canvasState))
  });
  state.future = [];
};

const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setComponents(state, action: PayloadAction<EditorComponent[]>) {
      saveHistory(state);
      state.components = action.payload;
    },
    addComponent(state, action: PayloadAction<EditorComponent>) {
      saveHistory(state);
      state.components.push(action.payload);
    },
    updateComponent(state, action: PayloadAction<EditorComponent>) {
      saveHistory(state);
      const index = state.components.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.components[index] = action.payload;
      }
    },
    deleteComponent(state, action: PayloadAction<string>) {
      saveHistory(state);
      state.components = state.components.filter(c => c.id !== action.payload);
    },
    setCanvasState(state, action: PayloadAction<Partial<CanvasState>>) {
      saveHistory(state);
      state.canvasState = { ...state.canvasState, ...action.payload };
    },
    undo(state) {
      const prev = state.past.pop();
      if (prev) {
        state.future.unshift({
          components: state.components,
          canvasState: state.canvasState
        });
        state.components = prev.components;
        state.canvasState = prev.canvasState;
      }
    },
    redo(state) {
      const next = state.future.shift();
      if (next) {
        state.past.push({
          components: state.components,
          canvasState: state.canvasState
        });
        state.components = next.components;
        state.canvasState = next.canvasState;
      }
    }
  }
});

export const {
  setComponents,
  addComponent,
  updateComponent,
  deleteComponent,
  setCanvasState,
  undo,
  redo
} = canvasSlice.actions;
export default canvasSlice.reducer;

import { AnyAction } from 'redux';
import undoable from 'redux-undo';
import type { BaseComponent } from '../types/component-base';
import type { Point } from '../types/editor-types';

export interface CanvasState {
  components: BaseComponent[];
  zoom: number;
  pan: Point;
}

const initialState: CanvasState = {
  components: [],
  zoom: 1,
  pan: { x: 0, y: 0 }
};

export const setComponents = (components: BaseComponent[]) => ({
  type: 'canvas/set' as const,
  payload: components
});

export const addComponent = (component: BaseComponent) => ({
  type: 'canvas/add' as const,
  payload: component
});

export const removeComponent = (id: string) => ({
  type: 'canvas/remove' as const,
  payload: id
});

export const updateComponent = (component: BaseComponent) => ({
  type: 'canvas/update' as const,
  payload: component
});

export const setZoom = (zoom: number) => ({
  type: 'canvas/setZoom' as const,
  payload: zoom
});

export const setPan = (pan: Point) => ({
  type: 'canvas/setPan' as const,
  payload: pan
});

export type CanvasActions =
  | ReturnType<typeof setComponents>
  | ReturnType<typeof addComponent>
  | ReturnType<typeof removeComponent>
  | ReturnType<typeof updateComponent>
  | ReturnType<typeof setZoom>
  | ReturnType<typeof setPan>;

const reducer = (
  state: CanvasState = initialState,
  action: CanvasActions
): CanvasState => {
  switch (action.type) {
    case 'canvas/set':
      return { ...state, components: action.payload };
    case 'canvas/add':
      return { ...state, components: [...state.components, action.payload] };
    case 'canvas/remove':
      return {
        ...state,
        components: state.components.filter((c) => c.id !== action.payload)
      };
    case 'canvas/update':
      return {
        ...state,
        components: state.components.map((c) =>
          c.id === action.payload.id ? action.payload : c
        )
      };
    case 'canvas/setZoom':
      return { ...state, zoom: action.payload };
    case 'canvas/setPan':
      return { ...state, pan: action.payload };
    default:
      return state;
  }
};

export const canvasReducer = undoable<CanvasState, AnyAction>(
  reducer as (state: CanvasState | undefined, action: AnyAction) => CanvasState
);

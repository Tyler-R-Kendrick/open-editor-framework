import { AnyAction } from 'redux';
import undoable from 'redux-undo';
import type { BaseComponent } from '../types/component-base';

export interface CanvasState {
  components: BaseComponent[];
  selectedComponents: string[];
}

const initialState: CanvasState = {
  components: [],
  selectedComponents: []
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

export const setSelectedComponents = (componentIds: string[]) => ({
  type: 'canvas/setSelected' as const,
  payload: componentIds
});

export const addSelectedComponent = (componentId: string) => ({
  type: 'canvas/addSelected' as const,
  payload: componentId
});

export const removeSelectedComponent = (componentId: string) => ({
  type: 'canvas/removeSelected' as const,
  payload: componentId
});

export const clearSelection = () => ({
  type: 'canvas/clearSelection' as const
});

export type CanvasActions =
  | ReturnType<typeof setComponents>
  | ReturnType<typeof addComponent>
  | ReturnType<typeof removeComponent>
  | ReturnType<typeof updateComponent>
  | ReturnType<typeof setSelectedComponents>
  | ReturnType<typeof addSelectedComponent>
  | ReturnType<typeof removeSelectedComponent>
  | ReturnType<typeof clearSelection>;

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
        components: state.components.filter((c) => c.id !== action.payload),
        selectedComponents: state.selectedComponents.filter(id => id !== action.payload)
      };
    case 'canvas/update':
      return {
        ...state,
        components: state.components.map((c) =>
          c.id === action.payload.id ? action.payload : c
        )
      };
    case 'canvas/setSelected':
      return { ...state, selectedComponents: action.payload };
    case 'canvas/addSelected':
      return {
        ...state,
        selectedComponents: [...state.selectedComponents, action.payload]
      };
    case 'canvas/removeSelected':
      return {
        ...state,
        selectedComponents: state.selectedComponents.filter(id => id !== action.payload)
      };
    case 'canvas/clearSelection':
      return { ...state, selectedComponents: [] };
    default:
      return state;
  }
};

export const canvasReducer = undoable<CanvasState, AnyAction>(
  reducer as (state: CanvasState | undefined, action: AnyAction) => CanvasState
);

import { BaseComponent } from '../src/types/component-base';

export type CanvasRenderer = (
  ctx: CanvasRenderingContext2D,
  component: BaseComponent
) => void;

export const defaultRenderers: Record<string, CanvasRenderer> = {
  text: (ctx, component) => {
    const { bounds, properties } = component;
    ctx.fillStyle = String(properties.color ?? '#000000');
    ctx.font = `${Number(properties.fontSize ?? 16)}px ${String(properties.fontFamily ?? 'Arial')}`;
    ctx.fillText(
      String(properties.text ?? 'Label'),
      bounds.x + 10,
      bounds.y + bounds.height / 2 + 6
    );
  },
  button: (ctx, component) => {
    const { bounds, properties } = component;
    ctx.fillStyle = String(properties.backgroundColor ?? '#3b82f6');
    ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
    ctx.fillStyle = String(properties.color ?? '#ffffff');
    ctx.font = `${Number(properties.fontSize ?? 14)}px ${String(properties.fontFamily ?? 'Arial')}`;
    ctx.textAlign = 'center';
    ctx.fillText(
      String(properties.text ?? 'Button'),
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2 + 4
    );
    ctx.textAlign = 'start';
  },
  container: (ctx, component) => {
    const { bounds, properties } = component;
    ctx.fillStyle = String(properties.backgroundColor ?? '#f3f4f6');
    ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
    ctx.strokeStyle = String(properties.borderColor ?? '#d1d5db');
    ctx.lineWidth = Number(properties.borderWidth ?? 1);
    ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
  }
};

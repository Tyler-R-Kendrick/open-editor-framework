import type { Bounds, Size } from "./editor-types";

// Define a more specific type for component properties
export type ComponentPropertyValue = string | number | boolean | null | undefined | ComponentPropertyValue[] | { [key: string]: ComponentPropertyValue };
export type ComponentProperties = Record<string, ComponentPropertyValue>;

export interface BaseComponentOptions {
  id: string;
  type: string;
  name: string;
  bounds: Bounds;
  properties?: ComponentProperties;
  zIndex?: number;
  parent?: string;
  children?: BaseComponent[];
}

export class BaseComponent {
  id: string;
  type: string;
  name: string;
  bounds: Bounds;
  properties: ComponentProperties;
  zIndex?: number;
  parent?: string;
  children?: BaseComponent[];

  constructor(opts: BaseComponentOptions) {
    this.id = opts.id;
    this.type = opts.type;
    this.name = opts.name;
    this.bounds = opts.bounds;
    this.properties = opts.properties ?? {};
    this.zIndex = opts.zIndex;
    this.parent = opts.parent;
    this.children = opts.children as BaseComponent[] | undefined;
  }

  updateProperties(props: ComponentProperties): void {
    this.properties = { ...this.properties, ...props };
  }
}

export interface MarketplaceComponentOptions extends Omit<BaseComponentOptions, 'bounds'> {
  icon: string;
  category: string;
  description: string;
  defaultSize: Size;
}

export class MarketplaceComponent extends BaseComponent {
  icon: string;
  category: string;
  description: string;
  defaultSize: Size;

  constructor(opts: MarketplaceComponentOptions) {
    super({
      id: opts.id,
      type: opts.type,
      name: opts.name,
      bounds: { x: 0, y: 0, width: opts.defaultSize.width, height: opts.defaultSize.height },
      properties: opts.properties,
      zIndex: opts.zIndex,
      parent: opts.parent,
      children: opts.children,
    });
    this.icon = opts.icon;
    this.category = opts.category;
    this.description = opts.description;
    this.defaultSize = opts.defaultSize;
  }

  get template() {
    return {
      type: this.type,
      defaultSize: this.defaultSize,
      properties: { ...this.properties },
    };
  }
}


import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent
} from 'lz-string';

export function encodeComponents(components: unknown[]): string {
  const json = JSON.stringify(components);
  return compressToEncodedURIComponent(json);
}

export function decodeComponents(value: string): unknown[] | null {
  try {
    let json = decompressFromEncodedURIComponent(value);
    if (!json) {
      json =
        typeof globalThis.atob === 'function'
          ? decodeURIComponent(escape(globalThis.atob(value)))
          : Buffer.from(value, 'base64').toString('utf-8');
    }
    return JSON.parse(json);
  } catch (_err) {
    console.warn('Failed to decode shared state');
    return null;
  }
}

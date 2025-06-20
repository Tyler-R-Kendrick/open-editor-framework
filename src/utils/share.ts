export function encodeComponents(components: unknown[]): string {
  const json = JSON.stringify(components);
  if (typeof globalThis.btoa === 'function') {
    return globalThis.btoa(unescape(encodeURIComponent(json)));
  }
  return Buffer.from(json, 'utf-8').toString('base64');
}

export function decodeComponents(value: string): unknown[] | null {
  try {
    const json =
      typeof globalThis.atob === 'function'
        ? decodeURIComponent(escape(globalThis.atob(value)))
        : Buffer.from(value, 'base64').toString('utf-8');
    return JSON.parse(json);
  } catch (_err) {
    console.warn('Failed to decode shared state');
    return null;
  }
}

import { encodeComponents, decodeComponents } from '../src/utils/share';

test('encode and decode roundtrip', () => {
  const components = [{ id: '1', type: 'text' }];
  const encoded = encodeComponents(components);
  const decoded = decodeComponents(encoded) as typeof components;
  expect(decoded).toEqual(components);
});

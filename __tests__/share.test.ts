import { encodeComponents, decodeComponents } from '../src/utils/share';

test('encode and decode roundtrip', () => {
  const components = [{ id: '1', type: 'text' }];
  const encoded = encodeComponents(components);
  const decoded = decodeComponents(encoded) as typeof components;
  expect(decoded).toEqual(components);
});

test('round-trips nested component trees losslessly', () => {
  const tree = [
    {
      id: 'root',
      type: 'container',
      name: 'Root',
      bounds: { x: 0, y: 0, width: 400, height: 300 },
      properties: { backgroundColor: '#ffffff' },
      children: [
        {
          id: 'child-1',
          type: 'text',
          name: 'Title',
          bounds: { x: 16, y: 16, width: 200, height: 32 },
          properties: { text: 'Hello “world” 🌍', fontSize: 18 },
          parent: 'root'
        }
      ]
    }
  ];

  const decoded = decodeComponents(encodeComponents(tree));
  expect(decoded).toEqual(tree);
});

test('returns null for invalid payloads', () => {
  expect(decodeComponents('%%%not-valid%%%')).toBeNull();
});

test('property-based round trips for randomized trees', () => {
  for (let i = 0; i < 25; i += 1) {
    const components = Array.from({ length: (i % 5) + 1 }, (_, index) => ({
      id: `c-${i}-${index}`,
      type: index % 2 === 0 ? 'text' : 'button',
      name: `Component ${index}`,
      bounds: {
        x: index * 10,
        y: index * 12,
        width: 80 + index,
        height: 40 + index
      },
      properties: {
        text: `label-${i}-${index}`,
        fontSize: 12 + index,
        visible: index % 2 === 0,
        color: `#${((i * 16 + index) % 0xffffff).toString(16).padStart(6, '0')}`
      }
    }));

    expect(decodeComponents(encodeComponents(components))).toEqual(components);
  }
});

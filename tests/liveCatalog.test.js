import { expect, it } from 'vitest';
import { filterCatalog } from '../src/services/liveCatalog.js';

const items = [
  { name: 'Blue hat', description: 'Cotton', category: 'Clothes', categorySlug: 'clothes' },
  { name: 'Red mug', description: 'Ceramic', category: 'Kitchen', categorySlug: 'kitchen' },
];

it('filters title and description and category slug/name together', () => {
  expect(filterCatalog(items, { query: 'cotton', category: 'clothes' })).toEqual([items[0]]);
  expect(filterCatalog(items, { query: 'mug', category: 'Clothes' })).toEqual([]);
  expect(filterCatalog(items, { category: 'Kitchen' })).toEqual([items[1]]);
});

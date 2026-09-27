import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, expect, it } from 'vitest';
import LiveStorefront from '../src/pages/LiveStorefront.jsx';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let root, container;
afterEach(() => { if (root) act(() => root.unmount()); container?.remove(); root = null; });

it('renders a newly fetched Strapi product and its category on the catalog', () => {
  container = document.createElement('div'); document.body.append(container); root = createRoot(container);
  act(() => root.render(<LiveStorefront page="listing" products={[{ id: 'new-doc', documentId: 'new-doc', name: 'Canvas hat', price: 16, stock: 2, category: 'Clothes', image: 'https://s3.example/hat.jpg' }]} categories={[{ id: 7, name: 'Clothes', slug: 'clothes' }]} onNavigate={() => {}} onAdd={() => {}} />));
  expect(container.textContent).toContain('Canvas hat');
  expect(container.textContent).toContain('Clothes');
  expect(container.querySelector('img[src="https://s3.example/hat.jpg"]')).not.toBeNull();
});

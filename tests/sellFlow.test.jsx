import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, expect, it, vi } from 'vitest';
import SellProductModal from '../src/components/SellProductModal.jsx';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let root, container;
afterEach(() => { if (root) act(() => root.unmount()); container?.remove(); root = null; vi.restoreAllMocks(); });

it('requires an authenticated user before showing the product form', () => {
  container = document.createElement('div'); document.body.append(container); root = createRoot(container);
  act(() => root.render(<SellProductModal isOpen token="" onClose={() => {}} />));
  expect(container.textContent).toMatch(/sign in/i);
  expect(container.querySelector('form')).toBeNull();
});

it('reuses an uploaded image when product creation fails and is retried', async () => {
  container = document.createElement('div'); document.body.append(container); root = createRoot(container);
  global.fetch = vi.fn()
    .mockResolvedValueOnce({ ok: true, json: async () => [{ id: 55 }] })
    .mockResolvedValueOnce({ ok: false, status: 400, text: async () => '{"error":{"message":"Invalid key category"}}' })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ data: { id: 10, documentId: 'new', title: 'Hat' } }) });
  act(() => root.render(<SellProductModal isOpen token="jwt" categories={[{ id: 1, documentId: 'categorydoc123', name: 'Hats' }]} onClose={() => {}} />));
  const change = async (name, value) => {
    const input = container.querySelector(`[name="${name}"]`);
    await act(async () => {
      Object.getOwnPropertyDescriptor(input.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : input.tagName === 'SELECT' ? window.HTMLSelectElement.prototype : window.HTMLInputElement.prototype, 'value').set.call(input, value);
      input.dispatchEvent(new Event(input.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
    });
  };
  await change('title', 'Hat'); await change('price', '20'); await change('category', 'categorydoc123');
  const image = container.querySelector('[name="image"]');
  Object.defineProperty(image, 'files', { configurable: true, value: [new File(['png'], 'hat.png', { type: 'image/png' })] });
  await act(async () => { image.dispatchEvent(new Event('change', { bubbles: true })); });
  const submit = async () => act(async () => { container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); });
  await submit();
  expect(container.textContent).toContain('Invalid key category');
  await submit();
  expect(fetch).toHaveBeenCalledTimes(3);
  expect(JSON.parse(fetch.mock.calls[2][1].body).data.category).toBe('categorydoc123');
});

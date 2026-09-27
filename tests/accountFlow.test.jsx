import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, expect, it, vi } from 'vitest';
import AccountModal from '../src/components/AccountModal.jsx';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let root, container;
afterEach(() => { if (root) act(() => root.unmount()); container?.remove(); root = null; });

it('opens a real registration form and submits username, email and password', async () => {
  container = document.createElement('div'); document.body.append(container);
  root = createRoot(container);
  const onRegister = vi.fn().mockResolvedValue({});
  act(() => root.render(<AccountModal onClose={() => {}} onRegister={onRegister} />));
  act(() => container.querySelector('.account-create button').click());
  expect(container.querySelector('[name="username"]')).not.toBeNull();
  for (const [name, value] of Object.entries({ username: 'sue', email: 'sue@example.com', password: 'password123' })) {
    const input = container.querySelector(`[name="${name}"]`);
    await act(async () => { Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(input, value); input.dispatchEvent(new Event('input', { bubbles: true })); });
  }
  await act(async () => { container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); });
  expect(onRegister).toHaveBeenCalledWith({ username: 'sue', email: 'sue@example.com', password: 'password123' });
});

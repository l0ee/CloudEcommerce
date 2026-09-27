import { afterEach, describe, expect, it, vi } from 'vitest';
import { readSession, saveSession, clearSession } from '../src/hooks/useAuth.js';

describe('account session', () => {
  afterEach(() => { window.localStorage.clear(); vi.restoreAllMocks(); });

  it('persists only the JWT and user, never the submitted password', () => {
    saveSession({ jwt: 'jwt-123', user: { id: 7, username: 'sue' }, password: 'hidden' });
    expect(readSession()).toEqual({ jwt: 'jwt-123', user: { id: 7, username: 'sue' } });
    expect(window.localStorage.getItem('shopcart_session')).not.toContain('hidden');
    clearSession();
    expect(readSession()).toBeNull();
  });

  it('ignores corrupt stored sessions', () => {
    window.localStorage.setItem('shopcart_session', '{bad');
    expect(readSession()).toBeNull();
  });
});

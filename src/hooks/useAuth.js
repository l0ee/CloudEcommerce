import { useEffect, useState } from 'react';
import { getCurrentUser, login as loginRequest, register as registerRequest } from '../services/authApi.js';

const KEY = 'shopcart_session';

export function readSession() {
  try {
    const session = JSON.parse(window.localStorage.getItem(KEY));
    return session?.jwt && session?.user ? session : null;
  } catch { return null; }
}

export function saveSession({ jwt, user }) {
  try { window.localStorage.setItem(KEY, JSON.stringify({ jwt, user })); } catch { /* storage unavailable */ }
}

export function clearSession() {
  try { window.localStorage.removeItem(KEY); } catch { /* storage unavailable */ }
}

export function useAuth() {
  const [session, setSession] = useState(readSession);
  const [ready, setReady] = useState(!session?.jwt);

  useEffect(() => {
    if (!session?.jwt) { setReady(true); return; }
    let active = true;
    getCurrentUser(session.jwt).then((user) => {
      if (!active) return;
      setSession({ jwt: session.jwt, user });
      saveSession({ jwt: session.jwt, user });
    }).catch(() => {
      if (!active) return;
      clearSession();
      setSession(null);
    }).finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, [session?.jwt]);

  const authenticate = async (request, fields) => {
    const next = await request(fields);
    if (!next?.jwt || !next?.user) throw new Error('Sign-in response did not include a session. Check Strapi email confirmation settings.');
    const saved = { jwt: next.jwt, user: next.user };
    saveSession(saved);
    setSession(saved);
    return saved;
  };

  return {
    user: session?.user || null,
    token: session?.jwt || '',
    ready,
    login: (fields) => authenticate(loginRequest, fields),
    register: (fields) => authenticate(registerRequest, fields),
    logout: () => { clearSession(); setSession(null); },
  };
}

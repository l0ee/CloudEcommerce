import { getStrapiApiUrl } from '../utils/strapi.js';

async function authRequest(path, options) {
  const response = await fetch(getStrapiApiUrl(path), options);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.error?.message || `Account request failed (${response.status})`);
  return body;
}

export function register({ username, email, password }) {
  return authRequest('/api/auth/local/register', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
}

export function login({ identifier, password }) {
  return authRequest('/api/auth/local', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });
}

export function getCurrentUser(jwt) {
  return authRequest('/api/users/me', { headers: { Authorization: `Bearer ${jwt}` } });
}

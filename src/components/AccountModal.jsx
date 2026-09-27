import React, { useEffect, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';

export function AccountModal({ onClose = () => {}, onLogin = async () => {}, onRegister = async () => {}, user = null, onLogout = () => {}, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const closeOnEscape = (event) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setBusy(true); setError('');
    try {
      if (mode === 'register') await onRegister({ username: username.trim(), email: email.trim(), password });
      else await onLogin({ identifier: email.trim(), password });
      onClose();
    } catch (err) { setError(err.message || 'Account request failed. Please retry.'); }
    finally { setBusy(false); }
  };

  return (
    <div className="modal-layer" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="account-modal" role="dialog" aria-modal="true" aria-labelledby="account-modal-title">
        <button className="modal-close" type="button" aria-label="Close account dialog" onClick={onClose}><X size={18} /></button>
        {user ? <>
          <span className="eyebrow">Your account</span>
          <h2 id="account-modal-title">Hello, {user.username}.</h2>
          <p>{user.email} · You can list products as a signed-in seller.</p>
          <button className="button button-green" type="button" onClick={() => { onLogout(); onClose(); }}>Sign out</button>
        </> : <>
          <span className="eyebrow">{mode === 'register' ? 'Join the store' : 'Welcome back'}</span>
          <h2 id="account-modal-title">{mode === 'register' ? 'Create an account' : 'Good to see you.'}</h2>
          <p>Sign in to sell products and keep your session across visits.</p>
          {error && <p className="form-error" role="alert">{error}</p>}
          <form onSubmit={submit}>
            {mode === 'register' && <label htmlFor="account-username">Username
              <input id="account-username" name="username" required autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>}
            <label htmlFor="account-email">Email address
              <input id="account-email" name="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label htmlFor="account-password">Password
              <input id="account-password" name="password" type="password" minLength={6} required autoComplete={mode === 'register' ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <button className="button button-green" type="submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'register' ? 'Create account' : 'Sign in'} <ArrowRight size={15} /></button>
          </form>
          <div className="account-create">{mode === 'register' ? 'Already have an account?' : 'New to Shopcart?'} <button type="button" onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setError(''); }}>{mode === 'register' ? 'Sign in' : 'Create an account'}</button></div>
        </>}
      </div>
    </div>
  );
}

export default AccountModal;

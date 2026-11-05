import { useState } from 'react';
import { Link } from 'react-router-dom';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  function submit(event) {
    event.preventDefault();
    const next = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Enter a valid email address.';
    if (password.length < 6) next.password = 'Enter at least 6 characters.';
    setErrors(next);
    setMessage(Object.keys(next).length ? '' : 'Authentication is not available in this demo yet.');
    if (!Object.keys(next).length) setPassword('');
  }
  return <div className="container form-page"><div className="page-intro"><p className="eyebrow">YOUR NEXT GOOD FIND</p><h1>Welcome <em>back.</em></h1><p>Sign-in is coming soon. You can browse bags without an account.</p></div><div className="form-layout"><div className="form-side"><h2>A place for<br /><em>your good finds.</em></h2><p>Explore bags and save reservations in this browser without signing in.</p><Link className="text-link" to="/">Back to Home</Link></div><form className="bag-form login-form" onSubmit={submit} noValidate>
    <div className="field"><label htmlFor="login-email">Email</label><input id="login-email" type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setMessage(''); }} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />{errors.email && <p id="email-error" className="field-error">{errors.email}</p>}</div>
    <div className="field"><label htmlFor="login-password">Password</label><input id="login-password" type="password" autoComplete="current-password" value={password} onChange={(e) => { setPassword(e.target.value); setMessage(''); }} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'password-error' : undefined} />{errors.password && <p id="password-error" className="field-error">{errors.password}</p>}</div>
    <button className="button button-primary" type="submit">Continue</button>{message && <p className="feedback" role="status">{message}</p>}
  </form></div></div>;
}

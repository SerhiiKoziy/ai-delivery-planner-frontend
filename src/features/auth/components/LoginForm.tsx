import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '../../../components/shared';
import { getApiErrorMessage } from '../../../utils/getApiErrorMessage';
import { useAuth } from '../api/useAuth';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const { login } = useAuth();

  const validate = () => {
    const errors: typeof fieldErrors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Enter a valid email address';
    if (password.length < 1) errors.password = 'Password is required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    login.mutate({ email, password });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {login.isError && (
        <div className="form-error">{getApiErrorMessage(login.error, 'Unable to log in.')}</div>
      )}

      <div className="field">
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          className={fieldErrors.email ? 'field__input--error' : ''}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {fieldErrors.email && <span className="field__error">{fieldErrors.email}</span>}
      </div>

      <div className="field">
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          className={fieldErrors.password ? 'field__input--error' : ''}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {fieldErrors.password && <span className="field__error">{fieldErrors.password}</span>}
      </div>

      <Button type="submit" className="btn--block" disabled={login.isPending}>
        {login.isPending ? 'Logging in...' : 'Log in'}
      </Button>

      <div className="auth-card__footer">
        Don&apos;t have an account? <Link to="/register">Sign up</Link>
      </div>
    </form>
  );
}

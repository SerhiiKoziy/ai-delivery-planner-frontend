import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '../../../components/shared';
import { getApiErrorMessage } from '../../../utils/getApiErrorMessage';
import { useAuth } from '../api/useAuth';

interface FieldErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const { register } = useAuth();

  const validate = () => {
    const errors: FieldErrors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Enter a valid email address';
    if (password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (confirmPassword !== password) errors.confirmPassword = 'Passwords do not match';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    register.mutate({ email, password });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {register.isError && (
        <div className="form-error">
          {getApiErrorMessage(register.error, 'Unable to create account.')}
        </div>
      )}

      <div className="field">
        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          autoComplete="email"
          className={fieldErrors.email ? 'field__input--error' : ''}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {fieldErrors.email && <span className="field__error">{fieldErrors.email}</span>}
      </div>

      <div className="field">
        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          type="password"
          autoComplete="new-password"
          className={fieldErrors.password ? 'field__input--error' : ''}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {fieldErrors.password && <span className="field__error">{fieldErrors.password}</span>}
      </div>

      <div className="field">
        <label htmlFor="register-confirm-password">Confirm password</label>
        <input
          id="register-confirm-password"
          type="password"
          autoComplete="new-password"
          className={fieldErrors.confirmPassword ? 'field__input--error' : ''}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {fieldErrors.confirmPassword && (
          <span className="field__error">{fieldErrors.confirmPassword}</span>
        )}
      </div>

      <Button type="submit" className="btn--block" disabled={register.isPending}>
        {register.isPending ? 'Creating account...' : 'Create account'}
      </Button>

      <div className="auth-card__footer">
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </form>
  );
}

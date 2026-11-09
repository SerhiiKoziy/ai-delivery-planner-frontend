import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '../../../components/shared';
import { getApiErrorMessage } from '../../../utils/getApiErrorMessage';
import { useResetPassword } from '../api/usePasswordReset';

interface Props {
  token: string;
}

export function ResetPasswordForm({ token }: Props) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirmPassword?: string }>(
    {},
  );
  const resetPassword = useResetPassword();
  const navigate = useNavigate();

  const validate = () => {
    const errors: typeof fieldErrors = {};
    if (password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (confirmPassword !== password) errors.confirmPassword = 'Passwords do not match';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    resetPassword.mutate(
      { token, newPassword: password },
      { onSuccess: () => navigate('/', { replace: true }) },
    );
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {resetPassword.isError && (
        <div className="form-error">
          {getApiErrorMessage(
            resetPassword.error,
            'This password reset link is invalid or has expired.',
          )}{' '}
          <Link to="/forgot-password">Request a new link</Link>
        </div>
      )}

      <div className="field">
        <label htmlFor="reset-password">New password</label>
        <input
          id="reset-password"
          type="password"
          autoComplete="new-password"
          className={fieldErrors.password ? 'field__input--error' : ''}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {fieldErrors.password && <span className="field__error">{fieldErrors.password}</span>}
      </div>

      <div className="field">
        <label htmlFor="reset-confirm-password">Confirm new password</label>
        <input
          id="reset-confirm-password"
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

      <Button type="submit" className="btn--block" disabled={resetPassword.isPending}>
        {resetPassword.isPending ? 'Saving...' : 'Set new password'}
      </Button>

      <div className="auth-card__footer">
        <Link to="/login">Back to log in</Link>
      </div>
    </form>
  );
}

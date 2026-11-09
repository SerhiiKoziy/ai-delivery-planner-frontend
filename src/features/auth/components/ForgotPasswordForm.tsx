import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '../../../components/shared';
import { getApiErrorMessage } from '../../../utils/getApiErrorMessage';
import { useForgotPassword } from '../api/usePasswordReset';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string>();
  const forgotPassword = useForgotPassword();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Enter a valid email address');
      return;
    }
    setEmailError(undefined);
    forgotPassword.mutate({ email });
  };

  if (forgotPassword.isSuccess) {
    return (
      <div className="auth-form">
        <p className="text-sm text-ink">
          If an account exists for <strong>{email}</strong>, we&apos;ve sent a link to reset the
          password. It expires in 30 minutes — check your spam folder if you don&apos;t see it.
        </p>
        <div className="auth-card__footer">
          <Link to="/login">Back to log in</Link>
        </div>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <p className="text-sm text-ink-muted mt-0 mb-4">
        Enter the email you signed up with and we&apos;ll send you a link to choose a new password.
      </p>

      {forgotPassword.isError && (
        <div className="form-error">
          {getApiErrorMessage(forgotPassword.error, 'Unable to send the reset link.')}
        </div>
      )}

      <div className="field">
        <label htmlFor="forgot-email">Email</label>
        <input
          id="forgot-email"
          type="email"
          autoComplete="email"
          className={emailError ? 'field__input--error' : ''}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <span className="field__error">{emailError}</span>}
      </div>

      <Button type="submit" className="btn--block" disabled={forgotPassword.isPending}>
        {forgotPassword.isPending ? 'Sending...' : 'Send reset link'}
      </Button>

      <div className="auth-card__footer">
        Remembered it? <Link to="/login">Log in</Link>
      </div>
    </form>
  );
}

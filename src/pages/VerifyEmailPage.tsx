import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { AuthLayout, useVerifyEmail } from '../features/auth';
import { getApiErrorMessage } from '../utils/getApiErrorMessage';

type VerificationState = 'pending' | 'success' | 'error';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const verifyEmail = useVerifyEmail();
  const attempted = useRef(false);
  const [state, setState] = useState<VerificationState>('pending');
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!token || attempted.current) return;
    attempted.current = true;
    // Driven by the mutateAsync promise rather than the mutation's own
    // reactive isPending/isSuccess flags — those can lag a render behind
    // when the mutate call is fired from an effect under StrictMode.
    verifyEmail.mutateAsync(token).then(
      () => setState('success'),
      (err) => {
        setError(err);
        setState('error');
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  let body: React.ReactNode;

  if (!token) {
    body = (
      <p className="text-sm text-danger">
        This verification link is missing its token. Please use the link from your email.
      </p>
    );
  } else if (state === 'pending') {
    body = (
      <div className="flex items-center gap-2 text-sm text-ink-muted">
        <div className="w-4 h-4 border-2 border-edge border-t-primary rounded-full animate-spin" />
        <span>Verifying your email…</span>
      </div>
    );
  } else if (state === 'success') {
    body = (
      <p className="text-sm text-ink">
        Your email is verified! <Link to="/">Go to the dashboard</Link>.
      </p>
    );
  } else {
    body = (
      <p className="text-sm text-danger">
        {getApiErrorMessage(error, 'This verification link is invalid or has expired.')}
      </p>
    );
  }

  return <AuthLayout title="Email verification">{body}</AuthLayout>;
}

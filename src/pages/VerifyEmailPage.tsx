import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { AuthLayout, useVerifyEmail } from '../features/auth';
import { getApiErrorMessage } from '../utils/getApiErrorMessage';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const verifyEmail = useVerifyEmail();
  const attempted = useRef(false);

  useEffect(() => {
    if (!token || attempted.current) return;
    attempted.current = true;
    verifyEmail.mutate(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  let body: React.ReactNode;

  if (!token) {
    body = (
      <p className="text-sm text-danger">
        This verification link is missing its token. Please use the link from your email.
      </p>
    );
  } else if (verifyEmail.isPending || verifyEmail.isIdle) {
    body = (
      <div className="flex items-center gap-2 text-sm text-ink-muted">
        <div className="w-4 h-4 border-2 border-edge border-t-primary rounded-full animate-spin" />
        <span>Verifying your email…</span>
      </div>
    );
  } else if (verifyEmail.isSuccess) {
    body = (
      <p className="text-sm text-ink">
        Your email is verified! <Link to="/">Go to the dashboard</Link>.
      </p>
    );
  } else {
    body = (
      <p className="text-sm text-danger">
        {getApiErrorMessage(verifyEmail.error, 'This verification link is invalid or has expired.')}
      </p>
    );
  }

  return <AuthLayout title="Email verification">{body}</AuthLayout>;
}

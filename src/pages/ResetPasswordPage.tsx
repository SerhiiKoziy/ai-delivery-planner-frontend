import { Link, useSearchParams } from 'react-router-dom';

import { AuthLayout, ResetPasswordForm } from '../features/auth';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  return (
    <AuthLayout title="Choose a new password">
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <p className="text-sm text-danger">
          This reset link is missing its token. Please use the link from your email, or{' '}
          <Link to="/forgot-password">request a new one</Link>.
        </p>
      )}
    </AuthLayout>
  );
}

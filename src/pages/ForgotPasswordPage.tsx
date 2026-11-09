import { AuthLayout, ForgotPasswordForm } from '../features/auth';

export function ForgotPasswordPage() {
  return (
    <AuthLayout title="Reset your password">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}

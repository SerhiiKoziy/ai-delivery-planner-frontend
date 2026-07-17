import { AuthLayout, LoginForm } from '../features/auth';

export function LoginPage() {
  return (
    <AuthLayout title="Log in to your account">
      <LoginForm />
    </AuthLayout>
  );
}

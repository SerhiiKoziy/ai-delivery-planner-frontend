import { AuthLayout, RegisterForm } from '../features/auth';

export function RegisterPage() {
  return (
    <AuthLayout title="Create your account">
      <RegisterForm />
    </AuthLayout>
  );
}

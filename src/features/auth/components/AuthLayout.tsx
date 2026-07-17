import type { PropsWithChildren, ReactNode } from 'react';

export interface AuthLayoutProps extends PropsWithChildren {
  title: ReactNode;
}

export function AuthLayout({ title, children }: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__brand">AI Delivery Planner</div>
        <div className="auth-card__title">{title}</div>
        {children}
      </div>
    </div>
  );
}

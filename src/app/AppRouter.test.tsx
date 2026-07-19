import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';

import { PrivateRoute } from './AppRouter';
import { useAuthStore } from '../store/authStore';

function renderPrivateRoute() {
  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route path="/login" element={<div>Login page</div>} />
        <Route
          path="/protected"
          element={
            <PrivateRoute>
              <div>Protected content</div>
            </PrivateRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('PrivateRoute', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, isAuthenticated: false });
  });

  it('redirects to /login when unauthenticated', () => {
    renderPrivateRoute();

    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });

  it('renders children when authenticated', () => {
    useAuthStore.setState({ token: 'fake-token', isAuthenticated: true });

    renderPrivateRoute();

    expect(screen.getByText('Protected content')).toBeInTheDocument();
    expect(screen.queryByText('Login page')).not.toBeInTheDocument();
  });
});

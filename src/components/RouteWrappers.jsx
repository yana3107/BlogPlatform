import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth.jsx';

import Header from './Header.jsx';
import SignInPage from '../pages/SignInPage.jsx';
import SignUpPage from '../pages/SignUpPage.jsx';

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <>
      <Header user={user} onLogout={logout} />
      <Outlet />
    </>
  );
}

export function SignInRoute() {
  const { user, login } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <SignInPage onLogin={login} />;
}

export function SignUpRoute() {
  const { user, login } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <SignUpPage onLogin={login} />;
}

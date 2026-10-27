import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ArticlesPage from './pages/ArticlesPage.jsx';
import ArticlePage from './pages/ArticlePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import SignInPage from './pages/SignInPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import Header from './components/Header.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          <Header user={user} onLogout={handleLogout} />
          <ArticlesPage />
        </>
      ),
    },
    {
      path: '/articles',
      element: (
        <>
          <Header user={user} onLogout={handleLogout} />
          <ArticlesPage />
        </>
      ),
    },
    {
      path: '/articles/:slug',
      element: (
        <>
          <Header user={user} onLogout={handleLogout} />
          <ArticlePage />
        </>
      ),
    },
    {
      path: '/sign-up',
      element: (
        <>
          <Header user={user} onLogout={handleLogout} />
          <SignUpPage onLogin={handleLogin} />
        </>
      ),
    },
    {
      path: '/sign-in',
      element: (
        <>
          <Header user={user} onLogout={handleLogout} />
          <SignInPage onLogin={handleLogin} />
        </>
      ),
    },
    {
      path: '/settings',
      element: (
        <>
          <Header user={user} onLogout={handleLogout} />
          <SettingsPage />
        </>
      ),
    },
    {
      path: '/profile',
      element: (
        <>
          <Header user={user} onLogout={handleLogout} />
          <ProfilePage />
        </>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

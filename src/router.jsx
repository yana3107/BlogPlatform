import { createBrowserRouter } from 'react-router-dom';

import {
  AppLayout,
  SignInRoute,
  SignUpRoute,
} from './components/RouteWrappers.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import ArticlesPage from './pages/ArticlesPage.jsx';
import ArticlePage from './pages/ArticlePage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <ArticlesPage />,
      },
      {
        path: 'articles',
        element: <ArticlesPage />,
      },
      {
        path: 'articles/:slug',
        element: <ArticlePage />,
      },
      {
        path: 'sign-in',
        element: <SignInRoute />,
      },
      {
        path: 'sign-up',
        element: <SignUpRoute />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'settings',
            element: <SettingsPage />,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
]);

export default router;

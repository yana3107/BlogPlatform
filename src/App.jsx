import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ArticlesPage from './pages/ArticlesPage.jsx';
import ArticlePage from './pages/ArticlePage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ArticlesPage />,
  },
  {
    path: '/articles',
    element: <ArticlesPage />,
  },
  {
    path: '/articles/:slug',
    element: <ArticlePage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

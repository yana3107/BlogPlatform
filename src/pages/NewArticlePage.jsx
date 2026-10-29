import ArticleForm from '../components/ArticleForm.jsx';
import { useAuth } from '../context/useAuth.jsx';
import { API_BASE_URL } from '../api/config.js';

function NewArticlePage() {
  const { user } = useAuth();

  async function createArticle(articleData) {
    const token = user?.token || localStorage.getItem('token');

    if (!token) {
      throw new Error('Please sign in to create an article.');
    }

    const response = await fetch(`${API_BASE_URL}/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ article: articleData }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.errors
          ? JSON.stringify(result.errors)
          : 'Failed to create the article.',
      );
    }

    return result.article;
  }

  return <ArticleForm submitText="Publish Article" onSubmit={createArticle} />;
}

export default NewArticlePage;

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ArticleForm from '../components/ArticleForm.jsx';
import { useAuth } from '../context/useAuth.jsx';
import { API_BASE_URL } from '../api/config.js';

function EditArticlePage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchArticle() {
      try {
        const response = await fetch(`${API_BASE_URL}/articles/${slug}`, {
          signal: controller.signal,
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error('Failed to load the article.');
        }

        if (result.article.author.username !== user?.username) {
          throw new Error('You can only edit your own articles.');
        }

        setArticle(result.article);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to load the article.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchArticle();

    return () => controller.abort();
  }, [slug, user]);

  async function updateArticle(articleData) {
    const token = user?.token || localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/articles/${slug}`, {
      method: 'PUT',
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
          : 'Failed to update the article.',
      );
    }

    return result.article;
  }

  if (isLoading) return <p>Loading article...</p>;
  if (error) return <p role="alert">{error}</p>;
  if (!article) return <p>Article not found.</p>;

  return (
    <ArticleForm
      key={article.slug}
      initialValues={article}
      submitText="Update Article"
      onSubmit={updateArticle}
    />
  );
}

export default EditArticlePage;

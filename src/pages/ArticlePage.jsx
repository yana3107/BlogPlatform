import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { API_BASE_URL } from '../api/config.js';

import { useAuth } from '../context/useAuth.jsx';
function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const controller = new AbortController();

    async function fetchArticle() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/articles/${slug}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to load article.');
        }

        const data = await response.json();
        setArticle(data.article);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchArticle();

    return () => controller.abort();
  }, [slug]);
  async function deleteArticle() {
    const token = user?.token || localStorage.getItem('token');

    if (!token) {
      setError('Please sign in to delete the article.');
      return;
    }

    try {
      setIsDeleting(true);

      const response = await fetch(`${API_BASE_URL}/articles/${slug}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete the article.');
      }

      navigate('/articles');
    } catch (err) {
      setError(err.message || 'Failed to delete the article.');
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  }
  if (loading) {
    return (
      <main className="article-page">
        <div className="loader">
          <span className="loader-spinner" />
          <span>Loading article...</span>
        </div>
      </main>
    );
  }

  if (error || !article) {
    return (
      <main className="article-page">
        <p className="article-page-message" role="alert">
          {error || 'Article not found.'}
        </p>
        <Link to="/articles" className="back-link">
          Back to all articles
        </Link>
      </main>
    );
  }

  const author = article.author;
  const username = author?.username || 'Unknown author';
  const avatar = author?.image;
  const tags = article.tagList || [];

  const formattedDate = article.createdAt
    ? format(new Date(article.createdAt), 'MMMM d, yyyy', {
        locale: enUS,
      })
    : '';

  return (
    <main className="article-page">
      <section className="article-banner">
        <div className="article-banner-content">
          <h1 className="article-banner-title">{article.title}</h1>

          <div className="article-banner-author">
            {avatar ? (
              <img
                className="article-banner-avatar"
                src={avatar}
                alt=""
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <span
                className="article-banner-avatar article-banner-avatar-placeholder"
                aria-hidden="true"
              >
                {username.charAt(0).toUpperCase()}
              </span>
            )}

            <div>
              <p className="article-banner-username">{username}</p>

              {formattedDate && (
                <time
                  className="article-banner-date"
                  dateTime={article.createdAt}
                >
                  {formattedDate}
                </time>
              )}
            </div>

            <div className="article-actions">
              <Link to={`/articles/${slug}/edit`}>Edit</Link>

              <button type="button" onClick={() => setIsDeleteModalOpen(true)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="article-content">
        <Link to="/articles" className="back-link">
          Back to all articles
        </Link>

        {article.description && (
          <p className="article-page-description">{article.description}</p>
        )}

        <div className="article-body">
          <ReactMarkdown>{article.body || ''}</ReactMarkdown>
        </div>

        {tags.length > 0 && (
          <div className="article-page-tags" aria-label="Article tags">
            {tags.map((tag) => (
              <span className="article-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      {isDeleteModalOpen && (
        <div className="modal-backdrop">
          <div
            className="confirmation-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
          >
            <h2 id="delete-modal-title">Delete Article</h2>

            <p>Are you sure you want to delete this article?</p>

            <div className="modal-actions">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={deleteArticle}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ArticlePage;

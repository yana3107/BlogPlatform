import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import '../App.css';
import { API_BASE_URL } from '../api/config.js';
import { toggleFavorite } from '../api/articles.js';
import { useAuth } from '../context/useAuth.jsx';
function ArticlesPage() {
  const { user } = useAuth();
  const [favoriteError, setFavoriteError] = useState('');
  const [favoriteLoading, setFavoriteLoading] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const pageFromUrl = Number(searchParams.get('page'));
  const currentPage =
    Number.isInteger(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [articlesCount, setArticlesCount] = useState(0);

  const limit = 10;
  const totalPages = Math.ceil(articlesCount / limit);
  const visiblePages = 7;

  const startPage = Math.max(
    1,
    Math.min(
      currentPage - Math.floor(visiblePages / 2),
      totalPages - visiblePages + 1,
    ),
  );

  const endPage = Math.min(totalPages, startPage + visiblePages - 1);

  const pageNumbers = Array.from(
    { length: Math.max(0, endPage - startPage + 1) },
    (_, index) => startPage + index,
  );

  useEffect(() => {
    const controller = new AbortController();

    async function fetchArticles() {
      try {
        setLoading(true);
        setError(null);

        const offset = (currentPage - 1) * limit;

        const response = await fetch(
          `${API_BASE_URL}/articles?limit=${limit}&offset=${offset}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error('Failed to load articles.');
        }

        const data = await response.json();

        setArticles(data.articles);
        setArticlesCount(data.articlesCount);
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

    fetchArticles();

    return () => controller.abort();
  }, [currentPage]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setSearchParams(
        (previousParams) => {
          const nextParams = new URLSearchParams(previousParams);

          if (totalPages === 1) {
            nextParams.delete('page');
          } else {
            nextParams.set('page', String(totalPages));
          }

          return nextParams;
        },
        { replace: true },
      );
    }
  }, [currentPage, totalPages, setSearchParams]);

  const changePage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    setSearchParams((previousParams) => {
      const nextParams = new URLSearchParams(previousParams);

      if (page === 1) {
        nextParams.delete('page');
      } else {
        nextParams.set('page', String(page));
      }

      return nextParams;
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  async function handleFavorite(article) {
    if (!user) {
      setFavoriteError('Please sign in to like articles.');
      return;
    }

    if (favoriteLoading.includes(article.slug)) {
      return;
    }

    setFavoriteError('');
    setFavoriteLoading((previous) => [...previous, article.slug]);

    try {
      const updatedArticle = await toggleFavorite(
        article.slug,
        article.favorited,
      );

      setArticles((previous) =>
        previous.map((item) =>
          item.slug === article.slug ? updatedArticle : item,
        ),
      );
    } catch (err) {
      setFavoriteError(err.message);
    } finally {
      setFavoriteLoading((previous) =>
        previous.filter((slug) => slug !== article.slug),
      );
    }
  }
  return (
    <main className="articles-page">
      <section className="hero-banner">
        <h1>Realworld Blog</h1>
        <p>A place to share your knowledge.</p>
      </section>

      <div className="articles-container">
        <h1 className="articles-heading">Articles</h1>
        {favoriteError && (
          <p className="articles-message" role="alert">
            {favoriteError}
          </p>
        )}
        {error && (
          <p className="articles-message" role="alert">
            Error: {error}
          </p>
        )}

        <div className="articles-list">
          {loading ? (
            <div className="loader" role="status">
              <span className="loader-spinner" />
              <span>Loading articles...</span>
            </div>
          ) : (
            !error &&
            articles.map((article) => (
              <article className="article-card" key={article.slug}>
                <div className="article-card-header">
                  <div className="article-author">
                    {article.author?.image ? (
                      <img
                        className="author-avatar"
                        src={article.author.image}
                        alt=""
                      />
                    ) : (
                      <div className="author-avatar author-avatar-placeholder">
                        {article.author?.username?.charAt(0).toUpperCase() ||
                          '?'}
                      </div>
                    )}

                    <div>
                      <p className="author-name">
                        {article.author?.username || 'Unknown author'}
                      </p>

                      <p className="article-date">
                        {article.createdAt
                          ? format(new Date(article.createdAt), 'MMMM d, yyyy')
                          : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    className={`favorite-button ${article.favorited ? 'favorited' : ''}`}
                    type="button"
                    disabled={favoriteLoading.includes(article.slug)}
                    onClick={() => handleFavorite(article)}
                    aria-pressed={Boolean(article.favorited)}
                    aria-label={
                      article.favorited ? 'Remove favorite' : 'Add favorite'
                    }
                  >
                    <span aria-hidden="true">♥</span>
                    {article.favoritesCount}
                  </button>{' '}
                </div>

                <Link
                  className="article-title"
                  to={`/articles/${article.slug}`}
                >
                  {article.title}
                </Link>

                <p className="article-description">{article.description}</p>

                <div className="article-tags">
                  {(article.tagList || []).map((tag) => (
                    <span className="article-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))
          )}

          {!loading && !error && articles.length === 0 && (
            <p>No articles found.</p>
          )}
        </div>

        {totalPages > 0 && (
          <nav className="pagination" aria-label="Pagination">
            {pageNumbers.map((page) => (
              <button
                className={`pagination-button ${
                  currentPage === page ? 'active' : ''
                }`}
                key={page}
                type="button"
                onClick={() => changePage(page)}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            ))}
          </nav>
        )}
      </div>
    </main>
  );
}

export default ArticlesPage;

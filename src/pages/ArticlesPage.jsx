import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesCount, setArticlesCount] = useState(0);

  const limit = 10;
  const totalPages = Math.ceil(articlesCount / limit);
  const pagesPerGroup = 7;

  const currentGroup = Math.ceil(currentPage / pagesPerGroup);
  const firstPage = (currentGroup - 1) * pagesPerGroup + 1;
  const lastPage = Math.min(firstPage + pagesPerGroup - 1, totalPages);

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        setError(null);

        const offset = (currentPage - 1) * limit;

        const response = await fetch(
          `https://realworld.habsida.net/api/articles?limit=${limit}&offset=${offset}`,
        );

        if (!response.ok) {
          throw new Error('Не удалось загрузить статьи');
        }

        const data = await response.json();

        setArticles(data.articles);
        setArticlesCount(data.articlesCount);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [currentPage]);

  if (loading) {
    return <p className="articles-message">Загрузка статей.</p>;
  }

  if (error) {
    return <p className="articles-message">Ошибка {error}</p>;
  }

  return (
    <main className="articles-page">
      <div className="articles-container">
        <h1 className="articles-heading">Articles</h1>

        <div className="articles-list">
          {articles.map((article) => (
            <article className="article-card" key={article.slug}>
              <div className="article-card-header">
                <div className="article-author">
                  {article.author.image ? (
                    <img
                      className="author-avatar"
                      src={article.author.image}
                      alt=""
                    />
                  ) : (
                    <div className="author-avatar author-avatar-placeholder">
                      {article.author.username?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <p className="author-name">{article.author.username}</p>
                    <p className="article-date">
                      {article.createdAt
                        ? new Date(article.createdAt).toLocaleDateString(
                            'en-US',
                            {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            },
                          )
                        : ''}
                    </p>
                  </div>
                </div>

                <button
                  className="favorite-button"
                  type="button"
                  disabled
                  aria-label={`Favorites: ${article.favoritesCount}`}
                >
                  <span aria-hidden="true">♥</span>
                  {article.favoritesCount}
                </button>
              </div>

              <Link className="article-title" to={`/articles/${article.slug}`}>
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
          ))}
        </div>

        {totalPages > 0 && (
          <nav className="pagination" aria-label="Pagination">
            {Array.from(
              { length: lastPage - firstPage + 1 },
              (_, index) => firstPage + index,
            ).map((page) => (
              <button
                className={`pagination-button ${
                  currentPage === page ? 'active' : ''
                }`}
                key={page}
                type="button"
                onClick={() => {
                  const nextPage =
                    page === lastPage && page < totalPages ? page + 1 : page;

                  setCurrentPage(nextPage);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
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

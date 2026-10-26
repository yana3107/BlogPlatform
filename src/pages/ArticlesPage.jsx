import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesCount, setArticlesCount] = useState(0);

  const limit = 10;
  const totalPages = Math.ceil(articlesCount / limit);

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
          throw new Error('Не удалось загрузить');
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
    return <p>Загрузка статей.</p>;
  }

  if (error) {
    return <p>Ошибка {error}</p>;
  }

  return (
    <div>
      <h1>Список статей</h1>

      {articles.map((article) => (
        <article key={article.slug}>
          <h2>
            <Link to={`/articles/${article.slug}`}>{article.title}</Link>
          </h2>
          <p>{article.description}</p>
          <p>Автор: {article.author.username}</p>
        </article>
      ))}

      <div>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Назад
        </button>

        <span>
          {' '}
          Страница {currentPage} из {totalPages}{' '}
        </span>

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Далее
        </button>
      </div>
    </div>
  );
}

export default ArticlesPage;

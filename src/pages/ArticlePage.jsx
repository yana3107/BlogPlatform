import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

function ArticlePage() {
  const { slug } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchArticle() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://realworld.habsida.net/api/articles/${slug}`,
        );

        if (!response.ok) {
          throw new Error('Не удалось загрузить');
        }

        const data = await response.json();
        setArticle(data.article);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [slug]);

  if (loading) {
    return <p>Загрузка статьи.</p>;
  }

  if (error) {
    return <p>Ошибка. {error}</p>;
  }

  return (
    <div>
      <Link to="/articles">Назад ко всем статьям</Link>

      <h1>{article.title}</h1>
      <p>Автор: {article.author.username}</p>
      <p>{article.description}</p>

      <ReactMarkdown>{article.body}</ReactMarkdown>
    </div>
  );
}

export default ArticlePage;

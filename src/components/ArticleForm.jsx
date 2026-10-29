import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ArticleForm({
  initialValues = {
    title: '',
    description: '',
    body: '',
    tagList: [],
  },
  onSubmit,
  submitText,
}) {
  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);
  const [body, setBody] = useState(initialValues.body);
  const [tags, setTags] = useState(initialValues.tagList.join(', '));
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !body.trim()) {
      setError('Title, description, and body are required.');
      return;
    }

    try {
      setIsSubmitting(true);

      const article = await onSubmit({
        title: title.trim(),
        description: description.trim(),
        body: body.trim(),
        tagList: tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      });

      if (article?.slug) {
        navigate(`/articles/${article.slug}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to save the article.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>{submitText}</h1>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div className="form-group">
          <label htmlFor="article-title">Title</label>
          <input
            id="article-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Article title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="article-description">Description</label>
          <input
            id="article-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What is this article about?"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="article-body">Text</label>
          <textarea
            id="article-body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Write your article..."
            rows={8}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="article-tags">Tags</label>
          <input
            id="article-tags"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="React, JavaScript"
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitText}
        </button>
      </form>
    </main>
  );
}

export default ArticleForm;

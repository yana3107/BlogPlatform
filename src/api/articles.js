import { API_BASE_URL } from './config.js';

export async function toggleFavorite(slug, isFavorited) {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Please sign in to like articles.');
  }

  const response = await fetch(`${API_BASE_URL}/articles/${slug}/favorite`, {
    method: isFavorited ? 'DELETE' : 'POST',
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.errors
        ? JSON.stringify(result.errors)
        : 'Failed to update article favorite.',
    );
  }

  return result.article;
}

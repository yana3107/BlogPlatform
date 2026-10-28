import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.jsx';
import { API_BASE_URL } from '../api/config.js';

function SettingsPage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      bio: user?.bio || '',
      image: user?.image || '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('root', {
          type: 'auth',
          message: 'Необходимо войти в аккаунт повторно.',
        });
        return;
      }

      const updatedUser = {
        username: data.username.trim(),
        email: data.email.trim(),
        bio: data.bio.trim(),
        image: data.image.trim() || null,
      };

      if (data.password.trim()) {
        updatedUser.password = data.password;
      }

      const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          user: updatedUser,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const messages = result.errors
          ? Object.entries(result.errors)
              .map(([field, value]) => {
                const message = Array.isArray(value)
                  ? value.join(', ')
                  : String(value);

                return `${field}: ${message}`;
              })
              .join('. ')
          : 'Не удалось сохранить настройки.';

        setError('root', {
          type: 'server',
          message: messages,
        });
        return;
      }

      updateUser(result.user);
      navigate('/');
    } catch {
      setError('root', {
        type: 'server',
        message: 'Ошибка соединения. Попробуйте ещё раз.',
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h1>Настройки профиля</h1>

        {errors.root && (
          <p role="alert" className="form-error">
            {errors.root.message}
          </p>
        )}

        <div className="form-group">
          <label htmlFor="username">Имя пользователя</label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            placeholder="Введите имя пользователя"
            aria-invalid={Boolean(errors.username)}
            {...register('username', {
              required: 'Введите имя пользователя',
              minLength: {
                value: 3,
                message: 'Минимум 3 символа',
              },
            })}
          />
          {errors.username && (
            <p role="alert" className="form-error">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Электронная почта</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Введите электронную почту"
            aria-invalid={Boolean(errors.email)}
            {...register('email', {
              required: 'Введите электронную почту',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Введите корректный email',
              },
            })}
          />
          {errors.email && (
            <p role="alert" className="form-error">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="bio">О себе</label>
          <textarea
            id="bio"
            rows={3}
            placeholder="Расскажите немного о себе"
            {...register('bio')}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Новый пароль</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="Введите новый пароль"
            aria-invalid={Boolean(errors.password)}
            {...register('password', {
              validate: (value) =>
                !value || value.length >= 6 || 'Минимум 6 символов',
            })}
          />
          {errors.password && (
            <p role="alert" className="form-error">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="image">URL изображения аватара</label>
          <input
            id="image"
            type="url"
            placeholder="https://example.com/avatar.png"
            aria-invalid={Boolean(errors.image)}
            {...register('image', {
              validate: (value) => {
                const imageUrl = value?.trim() || '';

                if (!imageUrl) {
                  return true;
                }

                try {
                  const url = new URL(imageUrl);

                  if (
                    !['http:', 'https:'].includes(url.protocol) ||
                    !url.hostname
                  ) {
                    return 'Укажите URL, начинающийся с http:// или https://';
                  }

                  return true;
                } catch {
                  return 'Введите корректный URL изображения';
                }
              },
            })}
          />
          {errors.image && (
            <p role="alert" className="form-error">
              {errors.image.message}
            </p>
          )}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Сохранение...' : 'Сохранить настройки'}
        </button>

        <button type="button" className="logout-button" onClick={handleLogout}>
          Выйти из аккаунта
        </button>
      </form>
    </main>
  );
}

export default SettingsPage;

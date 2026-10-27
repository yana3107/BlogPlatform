import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function SettingsPage() {
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: user.username || '',
      email: user.email || '',
      image: user.image || '',
      password: '',
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');

      const updatedUser = {
        username: data.username,
        email: data.email,
        image: data.image || null,
      };

      if (data.password.trim()) {
        updatedUser.password = data.password;
      }

      const response = await fetch('https://realworld.habsida.net/api/user', {
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
              .map(
                ([field, value]) =>
                  `${field}: ${Array.isArray(value) ? value.join(', ') : value}`,
              )
              .join('. ')
          : 'Не удалось сохранить настройки';

        setError('root', {
          type: 'server',
          message: messages,
        });

        return;
      }

      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('token', result.user.token);

      navigate('/');
      window.location.reload();
    } catch {
      setError('root', {
        type: 'server',
        message: 'Ошибка соединения. Попробуйте ещё раз.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Your Settings</h1>

      {errors.root && <p>{errors.root.message}</p>}

      <input
        type="text"
        placeholder="Username"
        {...register('username', {
          required: 'Введите username',
          minLength: {
            value: 3,
            message: 'Минимум 3 символа',
          },
        })}
      />
      {errors.username && <p>{errors.username.message}</p>}

      <input
        type="email"
        placeholder="Email"
        {...register('email', {
          required: 'Введите email',
          pattern: {
            value: /^\S+@\S+\.\S+$/,
            message: 'Введите корректный email',
          },
        })}
      />
      {errors.email && <p>{errors.email.message}</p>}

      <input
        type="password"
        placeholder="New password"
        {...register('password', {
          minLength: {
            value: 6,
            message: 'Минимум 6 символов',
          },
        })}
      />
      {errors.password && <p>{errors.password.message}</p>}

      <input type="url" placeholder="Avatar image URL" {...register('image')} />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save settings'}
      </button>
    </form>
  );
}

export default SettingsPage;

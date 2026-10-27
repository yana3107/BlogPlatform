import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function SignInPage({ onLogin }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await fetch(
        'https://realworld.habsida.net/api/users/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: {
              email: data.email,
              password: data.password,
            },
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          const messages = Object.entries(result.errors)
            .map(([field, value]) => {
              const message = Array.isArray(value)
                ? value.join(', ')
                : String(value);

              return `${field}: ${message}`;
            })
            .join('. ');

          setError('root', {
            type: 'server',
            message: messages || 'Не удалось войти. Проверьте данные.',
          });
        } else {
          setError('root', {
            type: 'server',
            message: 'Не удалось войти. Проверьте email и пароль.',
          });
        }

        return;
      }

      onLogin(result.user);
      navigate('/');
    } catch {
      setError('root', {
        type: 'server',
        message: 'Ошибка соединения. Проверьте интернет.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Sign In</h1>

      {errors.root && <p>{errors.root.message}</p>}

      <input
        type="email"
        placeholder="Email"
        {...register('email', {
          required: 'Введите email',
          pattern: {
            value: /^\S+@\S+\.\S+$/,
            message: 'Введите правильный email',
          },
        })}
      />
      {errors.email && <p>{errors.email.message}</p>}

      <input
        type="password"
        placeholder="Password"
        {...register('password', {
          required: 'Введите пароль',
        })}
      />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}

export default SignInPage;

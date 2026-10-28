import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api/config.js';

function SignUpPage({ onLogin }) {
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = useWatch({
    control,
    name: 'password',
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            username: data.username,
            email: data.email,
            password: data.password,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, value]) => {
            const message = Array.isArray(value)
              ? value.join(', ')
              : String(value);

            if (field === 'body' && message.includes('users.username')) {
              setError('username', {
                type: 'server',
                message: 'Имя пользователя уже занято',
              });
            } else if (['username', 'email', 'password'].includes(field)) {
              setError(field, {
                type: 'server',
                message,
              });
            } else {
              setError('root', {
                type: 'server',
                message,
              });
            }
          });
        } else {
          setError('root', {
            type: 'server',
            message: 'Не удалось зарегистрироваться. Попробуйте ещё раз.',
          });
        }

        return;
      }

      onLogin(result.user);
      navigate('/');
    } catch {
      setError('root', {
        type: 'server',
        message: 'Ошибка соединения.',
      });
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <h1>Create account</h1>

        {errors.root && (
          <p className="form-error" role="alert">
            {errors.root.message}
          </p>
        )}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            autoComplete="username"
            aria-invalid={Boolean(errors.username)}
            {...register('username', {
              required: 'Введите username',
              minLength: {
                value: 3,
                message: 'Минимум 3 символа',
              },
              maxLength: {
                value: 20,
                message: 'Максимум 20 символов',
              },
            })}
          />
          {errors.username && (
            <p className="form-error">{errors.username.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...register('email', {
              required: 'Введите email',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Введите правильный email',
              },
            })}
          />
          {errors.email && <p className="form-error">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            {...register('password', {
              required: 'Введите пароль',
              minLength: {
                value: 6,
                message: 'Минимум 6 символов',
              },
              maxLength: {
                value: 40,
                message: 'Максимум 40 символов',
              },
            })}
          />
          {errors.password && (
            <p className="form-error">{errors.password.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="repeatPassword">Repeat password</label>
          <input
            id="repeatPassword"
            type="password"
            placeholder="Repeat password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.repeatPassword)}
            {...register('repeatPassword', {
              required: 'Повторите пароль',
              validate: (value) => value === password || 'Пароль не совпадает',
            })}
          />
          {errors.repeatPassword && (
            <p className="form-error">{errors.repeatPassword.message}</p>
          )}
        </div>

        <div className="form-group agreement-group">
          <label htmlFor="agreement" className="agreement-label">
            <input
              id="agreement"
              type="checkbox"
              {...register('agreement', {
                required:
                  'Необходимо согласие на обработку персональных данных',
              })}
            />
            <span>Согласна на обработку персональных данных</span>
          </label>
          {errors.agreement && (
            <p className="form-error">{errors.agreement.message}</p>
          )}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </main>
  );
}

export default SignUpPage;

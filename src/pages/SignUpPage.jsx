import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

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
      const response = await fetch('https://realworld.habsida.net/api/users', {
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Create account</h1>

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
          maxLength: {
            value: 20,
            message: 'Максимум 20 символов',
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
      {errors.password && <p>{errors.password.message}</p>}

      <input
        type="password"
        placeholder="Repeat password"
        {...register('repeatPassword', {
          required: 'Повторите пароль',
          validate: (value) => value === password || 'Пароль не совпадает',
        })}
      />
      {errors.repeatPassword && <p>{errors.repeatPassword.message}</p>}

      <label>
        <input
          type="checkbox"
          {...register('agreement', {
            required: 'Необходимо согласие  обработку персональных данных',
          })}
        />
        Согласна на обработку персональных данных
      </label>
      {errors.agreement && <p>{errors.agreement.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
}

export default SignUpPage;

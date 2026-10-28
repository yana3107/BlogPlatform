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
                message: 'Username is already taken',
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
            message: 'Registration failed. Please try again.',
          });
        }

        return;
      }

      onLogin(result.user);
      navigate('/');
    } catch {
      setError('root', {
        type: 'server',
        message: 'Connection error. Please try again.',
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
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters long',
              },
              maxLength: {
                value: 20,
                message: 'Username must be no more than 20 characters long',
              },
            })}
          />
          {errors.username && (
            <p className="form-error" role="alert">
              {errors.username.message}
            </p>
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
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Please enter a valid email address',
              },
            })}
          />
          {errors.email && (
            <p className="form-error" role="alert">
              {errors.email.message}
            </p>
          )}
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
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters long',
              },
              maxLength: {
                value: 40,
                message: 'Password must be no more than 40 characters long',
              },
            })}
          />
          {errors.password && (
            <p className="form-error" role="alert">
              {errors.password.message}
            </p>
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
              required: 'Please repeat your password',
              validate: (value) =>
                value === password || 'Passwords do not match',
            })}
          />
          {errors.repeatPassword && (
            <p className="form-error" role="alert">
              {errors.repeatPassword.message}
            </p>
          )}
        </div>

        <div className="form-group agreement-group">
          <label htmlFor="agreement" className="agreement-label">
            <input
              id="agreement"
              type="checkbox"
              {...register('agreement', {
                required: 'You must agree to the processing of personal data',
              })}
            />
            <span>I agree to the processing of my personal data</span>
          </label>
          {errors.agreement && (
            <p className="form-error" role="alert">
              {errors.agreement.message}
            </p>
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

import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api/config.js';

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
      const response = await fetch(`${API_BASE_URL}/users/login`, {
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
      });

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
            message:
              messages || 'Unable to sign in. Please check your details.',
          });
        } else {
          setError('root', {
            type: 'server',
            message: 'Unable to sign in. Please check your email and password.',
          });
        }

        return;
      }

      onLogin(result.user);
      navigate('/');
    } catch {
      setError('root', {
        type: 'server',
        message: 'Connection error. Please check your internet connection.',
      });
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <h1>Sign In</h1>

        {errors.root && (
          <p className="form-error" role="alert">
            {errors.root.message}
          </p>
        )}

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
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            {...register('password', {
              required: 'Password is required',
            })}
          />
          {errors.password && (
            <p className="form-error" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="auth-switch">
          <Link to="/sign-up">Create an account</Link>
        </p>
      </form>
    </main>
  );
}

export default SignInPage;

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
          message: 'Authentication error.',
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
          : 'Failed to save settings.';

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
        message: 'Connection error. Please try again.',
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
        <h1>Your Settings</h1>

        {errors.root && (
          <p role="alert" className="form-error">
            {errors.root.message}
          </p>
        )}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            placeholder="Enter username"
            aria-invalid={Boolean(errors.username)}
            {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters long',
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
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Enter email"
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
            <p role="alert" className="form-error">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="Enter new password"
            aria-invalid={Boolean(errors.password)}
            {...register('password', {
              validate: (value) =>
                !value ||
                value.length >= 6 ||
                'Password must be at least 6 characters long',
            })}
          />
          {errors.password && (
            <p role="alert" className="form-error">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="image">Avatar Image URL</label>
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
                    return 'URL must start with http:// or https://';
                  }

                  return true;
                } catch {
                  return 'Please enter a valid image URL';
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
          {isSubmitting ? 'Saving...' : 'Save Settings'}
        </button>

        <button type="button" className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </form>
    </main>
  );
}

export default SettingsPage;

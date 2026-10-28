import { Link } from 'react-router-dom';
import '../App.css';

function Header({ user, onLogout }) {
  const username = user?.username || 'User';
  const avatar = user?.image;

  return (
    <header className="header">
      <nav>
        <Link to="/" className="brand">
          Realworld Blog
        </Link>

        <div className="header-links">
          <Link to="/">Home</Link>

          {user ? (
            <>
              <Link to="/settings">Settings</Link>

              <Link
                to="/profile"
                className="header-profile"
                aria-label={`Profile of ${username}`}
              >
                {avatar ? (
                  <img
                    className="header-avatar"
                    src={avatar}
                    alt=""
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <span
                    className="header-avatar header-avatar-placeholder"
                    aria-hidden="true"
                  >
                    {username.charAt(0).toUpperCase()}
                  </span>
                )}

                <span className="header-username">{username}</span>
              </Link>

              <button type="button" onClick={onLogout}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/sign-in">Sign in</Link>
              <Link to="/sign-up">Sign up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;

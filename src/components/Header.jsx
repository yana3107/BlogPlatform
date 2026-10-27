import { Link } from 'react-router-dom';
import '../App.css';

function Header({ user, onLogout }) {
  return (
    <>
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
                <Link to="/profile">{user.username}</Link>
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

      <section className="hero-banner">
        <h1>Realworld Blog</h1>
        <p>A place to share your knowledge.</p>
      </section>
    </>
  );
}

export default Header;

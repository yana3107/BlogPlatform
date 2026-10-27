function Header({ user, onLogout }) {
  return (
    <header className="header">
      <nav>
        <a href="/">Blog Platform</a>

        <div>
          <a href="/">Home</a>

          {user ? (
            <>
              <a href="/settings">Settings</a>
              <a href="/profile">{user.username}</a>
              <button onClick={onLogout}>Log Out</button>
            </>
          ) : (
            <>
              <a href="/sign-in">Sign in</a>
              <a href="/sign-up">Sign up</a>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;

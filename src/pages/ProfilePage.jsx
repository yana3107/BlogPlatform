function ProfilePage() {
  const user = JSON.parse(localStorage.getItem('user')) || {};

  return (
    <div>
      <h1>{user.username}</h1>
      {user.image && <img src={user.image} alt="User avatar" width="100" />}
      <p>{user.email}</p>
    </div>
  );
}

export default ProfilePage;

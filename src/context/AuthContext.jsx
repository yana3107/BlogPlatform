import { useState } from 'react';
import AuthContext from './AuthContextObject.jsx';

function getSavedUser() {
  try {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));

    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    const userWithToken = {
      ...updatedUser,
      token: updatedUser.token || localStorage.getItem('token'),
    };

    localStorage.setItem('user', JSON.stringify(userWithToken));

    if (userWithToken.token) {
      localStorage.setItem('token', userWithToken.token);
    }

    setUser(userWithToken);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

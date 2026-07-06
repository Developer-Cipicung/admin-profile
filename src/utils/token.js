const TOKEN_KEY = 'admin_access_token';

export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const USERNAME_KEY = 'admin_username';

export const saveUsername = (username) => {
  localStorage.setItem(USERNAME_KEY, username);
};

export const getUsername = () => {
  return localStorage.getItem(USERNAME_KEY);
};

export const removeUsername = () => {
  localStorage.removeItem(USERNAME_KEY);
};

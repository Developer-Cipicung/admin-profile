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

const ADMIN_DATA_KEY = 'admin_data';

export const saveAdminData = (adminData) => {
  localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(adminData));
};

export const getAdminData = () => {
  const data = localStorage.getItem(ADMIN_DATA_KEY);
  return data ? JSON.parse(data) : null;
};

export const removeAdminData = () => {
  localStorage.removeItem(ADMIN_DATA_KEY);
};

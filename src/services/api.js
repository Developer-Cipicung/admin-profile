import { getToken } from '../utils/token';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const token = getToken();
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  // When sending FormData, the browser must automatically set the Content-Type
  // header (including the boundary). If we manually set it to application/json, it breaks.
  if (config.body instanceof FormData && config.headers['Content-Type'] === 'application/json') {
    delete config.headers['Content-Type'];
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 401) {
        throw new UnauthorizedError(data?.message || 'Unauthorized: Invalid or expired token');
      }
      const error = new Error(data?.message || 'An error occurred during the request.');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export const api = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, data, options = {}) => request(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
  postForm: (endpoint, formData, options = {}) => request(endpoint, { ...options, method: 'POST', body: formData }),
  put: (endpoint, data, options = {}) => request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),
  putForm: (endpoint, formData, options = {}) => request(endpoint, { ...options, method: 'PUT', body: formData }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
};

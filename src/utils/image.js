const API_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || '';

/**
 * Returns a fully qualified image URL safely.
 * If the path is already an absolute URL (e.g. from R2 Public URL), it returns it as is.
 * Otherwise, it prepends the backend API host.
 * 
 * @param {string} path - The image path or URL
 * @param {string} fallback - The fallback image path if path is null
 * @returns {string} The full URL
 */
export const getFullImageUrl = (path, fallback = '/placeholder.png') => {
  if (!path) return fallback;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  
  // Clean leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${cleanPath}`;
};

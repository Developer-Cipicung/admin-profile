/**
 * Creates a URL query string from an object.
 * Ignores undefined, null, or empty string values.
 *
 * @param {Object} params - The key-value pairs to convert to a query string.
 * @returns {string} - Formatted query string (e.g. 'page=1&limit=10')
 */
export const createQueryString = (params) => {
  if (!params) return '';

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });

  return searchParams.toString();
};

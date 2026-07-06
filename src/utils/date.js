/**
 * Formats an ISO string to a localized Indonesian date string.
 *
 * @param {string} isoString - The ISO date string from the backend.
 * @returns {string} - Formatted date (e.g. '5 Juli 2026 14:00')
 */
export const formatDate = (isoString) => {
  if (!isoString) return '-';

  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch (error) {
    return isoString;
  }
};

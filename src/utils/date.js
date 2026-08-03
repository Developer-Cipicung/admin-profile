/**
 * Formats an ISO string to a localized Indonesian date string.
 *
 * @param {string} isoString - The ISO date string from the backend.
 * @returns {string} - Formatted date (e.g. '5 Juli 2026 14:00')
 */
export const formatDate = (isoString) => {
  if (!isoString) return '-';

  try {
    // If the database returns a naive timestamp (e.g. "2026-07-09T04:41:00")
    // without a 'Z' or timezone offset, JavaScript interprets it as local time.
    // We append 'Z' to force it to be treated as UTC before converting to WIB.
    const utcString = isoString.endsWith('Z') || isoString.includes('+') ? isoString : `${isoString}Z`;
    const date = new Date(utcString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
      timeZoneName: 'short'
    }).format(date);
  } catch (error) {
    return isoString;
  }
};

/**
 * Formats an ISO date string or timestamp into 'YYYY-MM-DD' for HTML date inputs.
 *
 * @param {string} isoString - The ISO date string from the backend.
 * @returns {string} - Formatted date string (e.g. '2026-08-03') or empty string.
 */
export const formatDateForInput = (isoString) => {
  if (!isoString) return '';

  try {
    const utcString = isoString.endsWith('Z') || isoString.includes('+') ? isoString : `${isoString}Z`;
    const date = new Date(utcString);
    if (isNaN(date.getTime())) return '';

    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(date);
  } catch {
    return '';
  }
};


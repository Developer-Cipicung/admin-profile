import { useState, useCallback } from 'react';
import { newsService } from '../services/news.service';

export const useDeleteNews = () => {
  const [deleting, setDeleting] = useState(false);
  const [serverError, setServerError] = useState(null);

  if (serverError && serverError.name === 'UnauthorizedError') {
    throw serverError;
  }

  const deleteNews = useCallback(async (id) => {
    setDeleting(true);
    setServerError(null);
    try {
      const response = await newsService.deleteNews(id);
      
      if (response.success) {
        return true;
      } else {
        setServerError('Failed to delete news article.');
        return false;
      }
    } catch (err) {
      if (err.name === 'UnauthorizedError') {
        setServerError(err);
      } else if (err.status === 404) {
        setServerError('News article not found. It may have been already deleted.');
      } else if (err.status === 400 || String(err.message).toLowerCase().includes('uuid')) {
        setServerError('Invalid news ID format.');
      } else {
        setServerError(err.message || 'An error occurred while deleting news.');
      }
      return false;
    } finally {
      setDeleting(false);
    }
  }, []);

  return {
    deleting,
    serverError,
    deleteNews,
  };
};

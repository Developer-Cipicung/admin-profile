import { useState, useCallback, useEffect } from 'react';
import { newsService } from '../services/news.service';
import { buildNewsFormData } from '../utils/formData';
import { useAuth } from '../contexts/AuthContext';

export const useEditNews = (id) => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [serverError, setServerError] = useState(null);
  const [newsData, setNewsData] = useState(null);

  const fetchNews = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await newsService.getNewsById(id);
      if (response.success) {
        setNewsData(response.data);
      } else {
        setError('Failed to fetch news article.');
      }
    } catch (err) {
      if (err.name === 'UnauthorizedError') {
        logout();
      } else if (err.status === 404) {
        setError('News article not found.');
      } else if (err.status === 400 || String(err.message).toLowerCase().includes('uuid')) {
        setError('Invalid news ID format.');
      } else {
        setError(err.message || 'An error occurred while fetching news.');
      }
    } finally {
      setLoading(false);
    }
  }, [id, logout]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const updateNews = useCallback(async (data) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const formData = buildNewsFormData(data);
      const response = await newsService.updateNews(id, formData);
      
      if (response.success) {
        return response.data;
      } else {
        setServerError('Failed to update news article.');
        return null;
      }
    } catch (err) {
      if (err.name === 'UnauthorizedError') {
        logout();
      }
      
      // If the backend returns validation errors as an array
      if (err.data && err.data.errors && Array.isArray(err.data.errors)) {
        const messages = err.data.errors.map(e => {
          if (typeof e === 'string') return e;
          return Object.values(e)[0];
        }).join(', ');
        setServerError(messages || 'Validation failed.');
      } else {
        setServerError(err.message || 'An error occurred while updating news.');
      }
      
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [id, logout]);

  return {
    newsData,
    loading,
    submitting,
    error,
    serverError,
    updateNews,
  };
};

import { useState, useCallback } from 'react';
import { newsService } from '../services/news.service';
import { buildNewsFormData } from '../utils/formData';
import { useAuth } from '../contexts/AuthContext';

export const useCreateNews = () => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitNews = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const formData = buildNewsFormData(data);
      const response = await newsService.createNews(formData);
      
      if (response.success) {
        return response.data;
      } else {
        setError('Failed to create news article.');
        return null;
      }
    } catch (err) {
      if (err.name === 'UnauthorizedError') {
        logout();
      }
      
      // If the backend returns validation errors as an array (e.g. from express-validator)
      if (err.data && err.data.errors && Array.isArray(err.data.errors)) {
        const messages = err.data.errors.map(e => Object.values(e)[0]).join(', ');
        setError(messages || 'Validation failed.');
      } else {
        setError(err.message || 'An error occurred while creating news.');
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [logout]);

  return {
    submitNews,
    loading,
    error,
  };
};

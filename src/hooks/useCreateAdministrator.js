import { useState } from 'react';
import { administratorService } from '../services/administrator.service';

export const useCreateAdministrator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (error && error.name === 'UnauthorizedError') {
    throw error;
  }

  const createAdministrator = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await administratorService.createAdministrator(data);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Failed to create administrator.');
        return { success: false };
      }
    } catch (err) {
      if (err.name === 'UnauthorizedError') {
        setError(err); // Render throws this to ErrorBoundary
        return { success: false };
      }
      
      if (err.status === 409 || err.message?.toLowerCase().includes('duplicate') || err.message?.toLowerCase().includes('already exists')) {
         setError('Username is already taken.');
      } else if (err.status === 400 && err.data?.message) {
         setError(err.data.message);
      } else {
         setError(err.message || 'An error occurred while creating the administrator.');
      }
      
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    createAdministrator,
    loading,
    error,
  };
};

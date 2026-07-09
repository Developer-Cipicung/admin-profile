import { useState, useEffect, useCallback } from 'react';
import { populationService } from '../services/population.service';

export const usePopulationSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await populationService.getSummary();
      if (response.success && response.data) {
        setSummary(response.data);
      } else {
        // Technically a 404 from the API will be caught by the catch block below
        setSummary(null);
      }
    } catch (err) {
      if (err.status === 404) {
        // Empty state: no snapshot yet
        setSummary(null);
      } else {
        setError(err.message || 'Failed to fetch population summary');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    summary,
    loading,
    error,
    refresh: fetchSummary,
  };
};

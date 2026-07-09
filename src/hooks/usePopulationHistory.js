import { useState, useCallback } from 'react';
import { populationHistoryService } from '../services/populationHistory.service';

export const usePopulationHistory = () => {
  const [history, setHistory] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  const fetchHistory = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await populationHistoryService.getHistory(params);
      if (response.success) {
        setHistory(response.data || []);
        
        const count = response.count || 0;
        const itemsPerPage = params.limit || 10;
        const currentPage = params.page || 1;
        
        setPagination({
          currentPage,
          totalPages: Math.ceil(count / itemsPerPage),
          totalItems: count,
          itemsPerPage
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch population history');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTrends = useCallback(async (params = {}) => {
    try {
      const response = await populationHistoryService.getTrends(params);
      if (response.success) {
        setTrends(response.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch trends:', err);
    }
  }, []);

  const getSnapshotDetails = async (id) => {
    const response = await populationHistoryService.getSnapshotDetails(id);
    return response.data;
  };

  const deleteSnapshot = async (id) => {
    return populationHistoryService.deleteSnapshot(id);
  };

  return {
    history,
    trends,
    loading,
    error,
    pagination,
    fetchHistory,
    fetchTrends,
    getSnapshotDetails,
    deleteSnapshot
  };
};

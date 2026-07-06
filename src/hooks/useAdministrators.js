import { useState, useEffect, useCallback } from 'react';
import { administratorService } from '../services/administrator.service';
import { ADMINISTRATOR_CONSTANTS } from '../constants/administrator.constants';
import { useDebounce } from './useDebounce';
import { createQueryString } from '../utils/queryParams';

export const useAdministrators = () => {
  const [administrators, setAdministrators] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  if (error && error.name === 'UnauthorizedError') {
    throw error;
  }
  
  const [filters, setFilters] = useState({
    page: 1,
    limit: ADMINISTRATOR_CONSTANTS.DEFAULT_PAGE_SIZE,
    search: '',
    sort: 'newest'
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  const fetchAdministrators = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryString = createQueryString({
        ...filters,
        search: debouncedSearch
      });
      
      const response = await administratorService.getAdministrators(queryString);
      
      if (response.success) {
        setAdministrators(response.data || []);
        setPagination(response.pagination);
      } else {
        setError('Failed to load data.');
      }
    } catch (err) {
      console.error('Failed to fetch administrators:', err);
      setError(err.name === 'UnauthorizedError' ? err : (err.message || 'Failed to load administrators. Please try again later.'));
    } finally {
      setLoading(false);
    }
  }, [filters.page, filters.limit, debouncedSearch, filters.sort]);

  useEffect(() => {
    fetchAdministrators();
  }, [fetchAdministrators]);

  const setPage = useCallback((page) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const setSearch = useCallback((searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
  }, []);

  const setSort = useCallback((sortValue) => {
    setFilters(prev => ({ ...prev, sort: sortValue, page: 1 }));
  }, []);

  const refresh = useCallback(() => {
    fetchAdministrators();
  }, [fetchAdministrators]);

  return {
    administrators,
    pagination,
    loading,
    error,
    filters,
    setPage,
    setSearch,
    setSort,
    refresh
  };
};

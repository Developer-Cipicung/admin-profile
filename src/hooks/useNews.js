import { useState, useEffect, useCallback } from 'react';
import { newsService } from '../services/news.service';
import { NEWS_CONSTANTS } from '../constants/news.constants';
import { useDebounce } from './useDebounce';

export const useNews = () => {
  const [news, setNews] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  if (error && error.name === 'UnauthorizedError') {
    throw error;
  }

  // Filters State
  const [filters, setFilters] = useState({
    page: 1,
    limit: NEWS_CONSTANTS.DEFAULT_PAGE_SIZE,
    search: '',
    sort: NEWS_CONSTANTS.SORT_OPTIONS[0].value,
  });

  // Debounced search to prevent rapid API calls
  const debouncedSearch = useDebounce(filters.search, NEWS_CONSTANTS.DEBOUNCE_DELAY_MS);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await newsService.getNews({
        page: filters.page,
        limit: filters.limit,
        search: debouncedSearch,
        sort: filters.sort,
      });

      if (response.success) {
        setNews(response.data);
        setPagination(response.pagination);
      } else {
        setError('Failed to load data.');
      }
    } catch (err) {
      setError(err.name === 'UnauthorizedError' ? err : (err.message || 'An error occurred while fetching news.'));
    } finally {
      setLoading(false);
    }
  }, [filters.page, filters.limit, debouncedSearch, filters.sort]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const refresh = useCallback(() => {
    fetchNews();
  }, [fetchNews]);

  const setPage = useCallback((newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  }, []);

  const setSearch = useCallback((newSearch) => {
    setFilters((prev) => ({ ...prev, search: newSearch, page: 1 }));
  }, []);

  const setSort = useCallback((newSort) => {
    setFilters((prev) => ({ ...prev, sort: newSort, page: 1 }));
  }, []);

  return {
    news,
    pagination,
    filters,
    loading,
    error,
    refresh,
    setPage,
    setSearch,
    setSort,
  };
};

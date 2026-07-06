import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/product.service';
import { PRODUCT_CONSTANTS } from '../constants/product.constants';
import { useDebounce } from './useDebounce';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (error && error.name === 'UnauthorizedError') {
    throw error;
  }

  // Filters State
  const [filters, setFilters] = useState({
    page: 1,
    limit: PRODUCT_CONSTANTS.DEFAULT_PAGE_SIZE,
    search: '',
    sort: PRODUCT_CONSTANTS.SORT_OPTIONS[0].value,
  });

  // Debounced search to prevent rapid API calls
  const debouncedSearch = useDebounce(filters.search, PRODUCT_CONSTANTS.DEBOUNCE_DELAY_MS);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getProducts({
        page: filters.page,
        limit: filters.limit,
        search: debouncedSearch,
        sort: filters.sort,
      });

      if (response.success) {
        setProducts(response.data);
        setPagination(response.pagination);
      } else {
        setError('Failed to load data.');
      }
    } catch (err) {
      setError(err.name === 'UnauthorizedError' ? err : (err.message || 'An error occurred while fetching products.'));
    } finally {
      setLoading(false);
    }
  }, [filters.page, filters.limit, debouncedSearch, filters.sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const refresh = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

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
    products,
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

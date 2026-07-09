import { useState, useCallback } from 'react';
import { populationSourceService } from '../services/populationSource.service';

export const usePopulationSources = () => {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCrawling, setIsCrawling] = useState(false);
  
  // Generic pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  const fetchSources = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await populationSourceService.getAll();
      if (response.success) {
        let data = response.data || [];
        
        // Frontend search and sorting since backend doesn't have it yet for sources
        if (params.search) {
          const lowerSearch = params.search.toLowerCase();
          data = data.filter(s => s.name.toLowerCase().includes(lowerSearch) || s.worksheet_name.toLowerCase().includes(lowerSearch));
        }

        if (params.sortBy) {
          data.sort((a, b) => {
            let valA = a[params.sortBy];
            let valB = b[params.sortBy];
            
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();
            
            if (valA < valB) return params.sortOrder === 'desc' ? 1 : -1;
            if (valA > valB) return params.sortOrder === 'desc' ? -1 : 1;
            return 0;
          });
        } else {
          // Default sort by created_at desc
          data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }

        const totalItems = data.length;
        const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);
        const currentPage = params.page || 1;
        
        const startIdx = (currentPage - 1) * pagination.itemsPerPage;
        const paginatedData = data.slice(startIdx, startIdx + pagination.itemsPerPage);

        setSources(paginatedData);
        setPagination(prev => ({
          ...prev,
          currentPage,
          totalPages,
          totalItems
        }));
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch sources');
    } finally {
      setLoading(false);
    }
  }, [pagination.itemsPerPage]);

  const createSource = async (data) => {
    const response = await populationSourceService.create(data);
    return response.data; // UI should catch errors
  };

  const updateSource = async (id, data) => {
    const response = await populationSourceService.update(id, data);
    return response.data;
  };

  const deleteSource = async (id) => {
    return populationSourceService.delete(id);
  };

  const activateSource = async (id) => {
    const response = await populationSourceService.activate(id);
    return response.data;
  };

  const crawlSource = async (sourceId, month, year) => {
    setIsCrawling(true);
    try {
      const response = await populationSourceService.crawl({ sourceId, month, year });
      return response.data;
    } finally {
      setIsCrawling(false);
    }
  };

  return {
    sources,
    loading,
    error,
    isCrawling,
    pagination,
    fetchSources,
    createSource,
    updateSource,
    deleteSource,
    activateSource,
    crawlSource
  };
};

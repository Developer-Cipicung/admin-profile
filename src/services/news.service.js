import { api } from './api';
import { createQueryString } from '../utils/queryParams';

export const newsService = {
  /**
   * Fetch paginated and filtered news list
   * @param {Object} params - { page, limit, search, sort }
   * @returns {Promise<Object>} API response
   */
  getNews: async (params) => {
    const queryString = createQueryString(params);
    const endpoint = queryString ? `/news?${queryString}` : '/news';
    return api.get(endpoint);
  },

  /**
   * Create a new news article
   * @param {FormData} formData - The payload containing title, content, and thumbnail
   * @returns {Promise<Object>} API response
   */
  createNews: async (formData) => {
    return api.postForm('/admin/news', formData);
  },

  /**
   * Fetch a single news article by ID
   * @param {string} id - The UUID of the news article
   * @returns {Promise<Object>} API response
   */
  getNewsById: async (id) => {
    return api.get(`/news/${id}`);
  },

  /**
   * Update an existing news article
   * @param {string} id - The UUID of the news article
   * @param {FormData} formData - The payload containing title, content, and optionally thumbnail
   * @returns {Promise<Object>} API response
   */
  updateNews: async (id, formData) => {
    return api.putForm(`/admin/news/${id}`, formData);
  },

  /**
   * Delete a news article by ID
   * @param {string} id - The UUID of the news article
   * @returns {Promise<Object>} API response
   */
  deleteNews: async (id) => {
    return api.delete(`/admin/news/${id}`);
  },
};

import { api } from './api';

export const administratorService = {
  /**
   * Fetch administrators with pagination, search, and sorting
   * @param {string} queryString - Query string
   * @returns {Promise<Object>} API response
   */
  getAdministrators: async (queryString = '') => {
    return api.get(`/admin/administrators?${queryString}`);
  },
  
  /**
   * Create a new administrator
   * @param {Object} data - Administrator data
   * @returns {Promise<Object>} API response
   */
  createAdministrator: async (data) => {
    return api.post('/admin/administrators', data);
  },
  
  /**
   * Delete an administrator
   * @param {string} id - Administrator UUID
   * @returns {Promise<Object>} API response
   */
  deleteAdministrator: async (id) => {
    return api.delete(`/admin/administrators/${id}`);
  }
};

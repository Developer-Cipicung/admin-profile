import { api } from './api';

export const populationService = {
  /**
   * Fetch the latest population summary snapshot
   * @returns {Promise<Object>} API response
   */
  getSummary: async () => {
    return api.get('/admin/population/summary');
  },
};

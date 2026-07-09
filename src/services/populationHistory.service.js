import { api } from './api';

export const populationHistoryService = {
  getHistory: async (params = {}) => {
    const query = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        query.append(key, params[key]);
      }
    });
    const queryString = query.toString();
    const endpoint = queryString ? `/admin/population/history?${queryString}` : '/admin/population/history';
    return api.get(endpoint);
  },

  getSnapshotDetails: async (id) => {
    return api.get(`/admin/population/history/${id}`);
  },

  getTrends: async (params = {}) => {
    const query = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        query.append(key, params[key]);
      }
    });
    const queryString = query.toString();
    const endpoint = queryString ? `/admin/population/trends?${queryString}` : '/admin/population/trends';
    return api.get(endpoint);
  },

  deleteSnapshot: async (id) => {
    return api.delete(`/admin/population/history/${id}`);
  }
};

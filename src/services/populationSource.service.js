import { api } from './api';

export const populationSourceService = {
  getAll: async () => {
    return api.get('/admin/population/sources');
  },

  create: async (data) => {
    return api.post('/admin/population/sources', data);
  },

  update: async (id, data) => {
    return api.put(`/admin/population/sources/${id}`, data);
  },

  delete: async (id) => {
    return api.delete(`/admin/population/sources/${id}`);
  },

  activate: async (id) => {
    return api.post(`/admin/population/sources/${id}/activate`);
  },

  crawl: async (data) => {
    return api.post(`/admin/population/crawl`, data);
  }
};

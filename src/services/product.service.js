import { api } from './api';
import { createQueryString } from '../utils/queryParams';

export const productService = {
  /**
   * Fetch paginated and filtered products list
   * @param {Object} params - { page, limit, search, sort }
   * @returns {Promise<Object>} API response
   */
  getProducts: async (params) => {
    const queryString = createQueryString(params);
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    return api.get(endpoint);
  },
  
  /**
   * Create a new product
   * @param {FormData} formData - The product form data (multipart/form-data)
   * @returns {Promise<Object>} API response
   */
  createProduct: async (formData) => {
    return api.postForm('/admin/products', formData);
  },

  /**
   * Get a single product by ID
   * @param {string} id - The product ID
   * @returns {Promise<Object>} API response
   */
  getProductById: async (id) => {
    return api.get(`/products/${id}`);
  },

  /**
   * Update an existing product
   * @param {string} id - The product ID
   * @param {FormData} formData - The product form data (multipart/form-data)
   * @returns {Promise<Object>} API response
   */
  updateProduct: async (id, formData) => {
    return api.putForm(`/admin/products/${id}`, formData);
  },

  /**
   * Delete a product
   * @param {string} id - The product ID
   * @returns {Promise<Object>} API response
   */
  deleteProduct: async (id) => {
    return api.delete(`/admin/products/${id}`);
  },
};

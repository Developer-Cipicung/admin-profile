import { useState, useCallback } from 'react';
import { productService } from '../services/product.service';
import { buildProductFormData } from '../utils/formData';
import { useAuth } from '../contexts/AuthContext';

export const useEditProduct = (id) => {
  const { logout } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [serverError, setServerError] = useState(null);

  const fetchProduct = useCallback(async () => {
    try {
      setFetching(true);
      setServerError(null);
      const response = await productService.getProductById(id);
      
      if (response.success && response.data) {
        setProduct(response.data);
      } else {
        setServerError('Product not found.');
      }
    } catch (err) {
      if (err.name === 'UnauthorizedError') {
        logout();
      } else {
        setServerError(err.message || 'Failed to fetch product.');
      }
    } finally {
      setFetching(false);
    }
  }, [id, logout]);

  const updateProduct = async (data) => {
    setLoading(true);
    setServerError(null);

    try {
      const formData = buildProductFormData(data);
      const response = await productService.updateProduct(id, formData);

      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setServerError(response.message || 'Failed to update product.');
        return { success: false };
      }
    } catch (err) {
      if (err.name === 'UnauthorizedError') {
        logout();
      }
      const message = err.data?.message || err.message || 'An error occurred during update.';
      setServerError(message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    product,
    fetchProduct,
    updateProduct,
    loading,
    fetching,
    serverError,
  };
};

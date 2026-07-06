import { useState } from 'react';
import { productService } from '../services/product.service';
import { buildProductFormData } from '../utils/formData';
import { useAuth } from '../contexts/AuthContext';

export const useCreateProduct = () => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const createProduct = async (data) => {
    setLoading(true);
    setServerError(null);

    try {
      const formData = buildProductFormData(data);
      const response = await productService.createProduct(formData);

      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setServerError(response.message || 'Failed to create product.');
        return { success: false };
      }
    } catch (err) {
      if (err.name === 'UnauthorizedError') {
        logout();
      }
      const message = err.data?.message || err.message || 'An error occurred during submission.';
      setServerError(message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    createProduct,
    loading,
    serverError,
  };
};

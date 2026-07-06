import { useState } from 'react';
import { productService } from '../services/product.service';

export const useDeleteProduct = () => {
  const [deleting, setDeleting] = useState(false);
  const [serverError, setServerError] = useState(null);

  if (serverError && serverError.name === 'UnauthorizedError') {
    throw serverError;
  }

  const deleteProduct = async (id) => {
    setDeleting(true);
    setServerError(null);

    try {
      const response = await productService.deleteProduct(id);
      if (response.success) {
        return true;
      } else {
        setServerError(response.message || 'Failed to delete product.');
        return false;
      }
    } catch (err) {
      setServerError(err.name === 'UnauthorizedError' ? err : (err.data?.message || err.message || 'An error occurred during deletion.'));
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return {
    deleting,
    serverError,
    deleteProduct,
  };
};

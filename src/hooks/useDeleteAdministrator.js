import { useState } from 'react';
import { administratorService } from '../services/administrator.service';

export const useDeleteAdministrator = () => {
  const [deleting, setDeleting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const deleteAdministrator = async (id) => {
    setDeleting(true);
    setServerError(null);
    try {
      const response = await administratorService.deleteAdministrator(id);
      if (response.success) {
        return true;
      } else {
        setServerError(response.message || 'Failed to delete administrator.');
        return false;
      }
    } catch (err) {
      if (err.name === 'UnauthorizedError') {
        setServerError(err); // Render throws this
      } else if (err.status === 403) {
        setServerError(err.data?.message || err.message || 'Cannot delete the last remaining administrator.');
      } else if (err.status === 404) {
        setServerError('Administrator not found. It may have already been deleted.');
      } else if (err.status === 400 || String(err.message).toLowerCase().includes('uuid')) {
        setServerError('Invalid administrator ID format.');
      } else {
        setServerError(err.message || 'An error occurred while deleting the administrator.');
      }
      return false;
    } finally {
      setDeleting(false);
    }
  };

  if (serverError && serverError.name === 'UnauthorizedError') {
    throw serverError;
  }

  return {
    deleting,
    serverError,
    deleteAdministrator,
  };
};

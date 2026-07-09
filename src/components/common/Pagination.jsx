import React from 'react';
import { Button } from './Button';

export const Pagination = ({ pagination, onPageChange, disabled }) => {
  if (!pagination) return null;

  const { page, totalPages, hasPrevious, hasNext } = pagination;

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg mt-4">
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          variant="secondary"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevious || disabled}
        >
          Sebelumnya
        </Button>
        <Button
          variant="secondary"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext || disabled}
        >
          Selanjutnya
        </Button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Halaman <span className="font-medium">{page}</span> dari <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={() => onPageChange(page - 1)}
            disabled={!hasPrevious || disabled}
          >
            Sebelumnya
          </Button>
          <Button
            variant="secondary"
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNext || disabled}
          >
            Selanjutnya
          </Button>
        </div>
      </div>
    </div>
  );
};

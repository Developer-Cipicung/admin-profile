import React, { useEffect, useRef } from 'react';
import { Button } from './Button';

export const DeleteConfirmationModal = ({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  loading = false,
  serverError = null,
  onConfirm,
  onCancel,
}) => {
  const cancelRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (open && e.key === 'Escape' && !loading) {
        onCancel();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      // Autofocus cancel button for safety
      setTimeout(() => {
        if (cancelRef.current) {
          cancelRef.current.focus();
        }
      }, 50);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 sm:p-0">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 transition-opacity" 
        onClick={() => !loading && onCancel()}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div 
        className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg w-full max-w-sm"
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-title"
      >
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  {message}
                </p>
              </div>

              {serverError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                  {serverError}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
          <Button
            type="button"
            variant="danger"
            className="w-full sm:w-auto"
            onClick={onConfirm}
            isLoading={loading}
            disabled={loading}
          >
            {loading ? 'Deleting...' : confirmLabel}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto mt-3 sm:mt-0"
            onClick={onCancel}
            disabled={loading}
            ref={cancelRef}
          >
            {cancelLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

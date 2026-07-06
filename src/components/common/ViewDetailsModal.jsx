import React, { useEffect, useRef } from 'react';
import { Button } from './Button';

export const ViewDetailsModal = ({
  open,
  title,
  image,
  fields = [],
  onClose,
}) => {
  const closeRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (open && e.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      // Autofocus close button for accessibility and keyboard navigation
      setTimeout(() => {
        if (closeRef.current) {
          closeRef.current.focus();
        }
      }, 50);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 sm:p-0">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div 
        className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-2xl w-full max-h-[90vh] flex flex-col"
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-title"
      >
        <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center shrink-0">
          <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
            {title}
          </h3>
          <button
            type="button"
            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {image && (
            <div className="mb-6 rounded-lg overflow-hidden border border-gray-200">
              <img 
                src={image} 
                alt={title} 
                className="w-full h-auto max-h-64 object-cover"
                onError={(e) => { e.target.src = '/placeholder.png' }}
              />
            </div>
          )}
          
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            {fields.map((field, index) => (
              <div key={index} className={field.fullWidth ? 'sm:col-span-2' : 'sm:col-span-1'}>
                <dt className="text-sm font-medium text-gray-500">{field.label}</dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{field.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        
        <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end shrink-0">
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={onClose}
            ref={closeRef}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

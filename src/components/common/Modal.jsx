import React, { useEffect, useRef } from 'react';

export const Modal = ({
  open,
  title,
  onClose,
  children
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
        className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg w-full flex flex-col"
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
            ref={closeRef}
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Button } from './Button';

export const ImageUpload = ({ 
  label = 'Image (Optional)', 
  value, 
  previewUrl, 
  onChange, 
  onRemove, 
  disabled,
  accept = '.jpg,.jpeg,.png,.webp'
}) => {
  const [localPreview, setLocalPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (value && value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setLocalPreview(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else {
      setLocalPreview(null);
    }
  }, [value]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      onChange(file);
    }
  };

  const handleRemove = () => {
    if (onRemove) onRemove();
  };

  const currentPreview = localPreview || previewUrl;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      {currentPreview ? (
        <div className="relative inline-block">
          <img 
            src={currentPreview} 
            alt="Image preview" 
            className="w-full max-w-sm h-48 object-cover rounded-lg border border-gray-200 bg-gray-50"
          />
          {(localPreview || onRemove) && (
            <div className="mt-2 flex space-x-2">
              <Button 
                type="button" 
                variant="danger" 
                onClick={handleRemove} 
                disabled={disabled}
                className="text-xs py-1 px-3"
              >
                Remove image
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full max-w-sm">
          <label 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors
              ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className={`w-8 h-8 mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-500'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p className={`mb-2 text-sm ${isDragging ? 'text-blue-600' : 'text-gray-500'}`}>
                <span className="font-semibold">{isDragging ? 'Drop image here' : 'Click to upload'}</span> {isDragging ? '' : 'or drag and drop'}
              </p>
              <p className="text-xs text-gray-500">JPG, JPEG, PNG, WEBP (Max 5MB)</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept={accept} 
              onChange={handleFileChange}
              disabled={disabled}
            />
          </label>
        </div>
      )}
    </div>
  );
};

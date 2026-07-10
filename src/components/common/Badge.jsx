import React from 'react';

const VARIANTS = {
  red: 'bg-red-100 text-red-800',
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-green-100 text-green-800',
  purple: 'bg-purple-100 text-purple-800',
  gray: 'bg-gray-100 text-gray-800',
};

export const Badge = ({ children, variant = 'gray', className = '' }) => {
  const colorClass = VARIANTS[variant] || VARIANTS.gray;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} ${className}`}>
      {children}
    </span>
  );
};

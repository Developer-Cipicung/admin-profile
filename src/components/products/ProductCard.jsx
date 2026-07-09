import React from 'react';
import { useNavigate } from 'react-router';
import { formatDate } from '../../utils/date';
import { formatCurrency } from '../../utils/currency';
import { Card, CardBody } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const ProductCard = ({ data, loading, onView, onDelete }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="lg:hidden flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="lg:hidden space-y-4">
      {data.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <img 
            src={import.meta.env.VITE_API_URL.replace('/api/v1', '') + (item.image_url || '/uploads/default-product.png')}
            alt={item.name} 
            className="w-full h-48 object-cover bg-gray-100"
            onError={(e) => { e.target.src = '/placeholder.png' }}
          />
          <CardBody>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{item.name}</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {formatCurrency(item.price)}
              </span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 mb-4">{item.description}</p>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Dibuat: {formatDate(item.created_at)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Diperbarui: {formatDate(item.updated_at)}</span>
            </div>
            <div className="mt-4 flex justify-end space-x-3 pt-3 border-t border-gray-100">
              <button 
                onClick={() => onView(item)}
                className="text-xs font-medium text-blue-600"
              >
                Lihat
              </button>
              <button 
                onClick={() => navigate(`/products/${item.id}/edit`)}
                className="text-xs font-medium text-indigo-600"
              >
                Edit
              </button>
              <button 
                onClick={() => onDelete(item)}
                className="text-xs font-medium text-red-600"
              >
                Hapus
              </button>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

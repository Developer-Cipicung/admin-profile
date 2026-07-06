import React from 'react';
import { Link } from 'react-router';
import { formatDate } from '../../utils/date';
import { Card, CardBody } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const NewsCard = ({ data, loading, onView, onDelete }) => {
  if (loading) {
    return (
      <div className="lg:hidden flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
      {data.map((item) => (
        <Card key={item.id} className="flex flex-col">
          <div className="aspect-video w-full bg-gray-100 overflow-hidden">
            <img 
              src={import.meta.env.VITE_API_URL.replace('/api/v1', '') + item.thumbnail_url}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = '/placeholder.png' }}
            />
          </div>
          <CardBody className="flex-1 flex flex-col">
            <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
            <div className="mt-auto space-y-1 text-xs text-gray-500">
              <p>Created: {formatDate(item.created_at)}</p>
              <p>Updated: {formatDate(item.updated_at)}</p>
            </div>
            <div className="mt-4 flex justify-end space-x-3 pt-3 border-t border-gray-100">
              <button 
                onClick={() => onView(item)}
                className="text-xs font-medium text-blue-600"
              >
                View
              </button>
              <Link to={`/news/${item.id}/edit`} className="text-xs font-medium text-indigo-600">Edit</Link>
              <button 
                onClick={() => onDelete(item)}
                className="text-xs font-medium text-red-600"
              >
                Delete
              </button>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

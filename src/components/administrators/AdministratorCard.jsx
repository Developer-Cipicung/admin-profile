import React from 'react';
import { formatDate } from '../../utils/date';
import { Card, CardBody } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const AdministratorCard = ({ data, loading, onView, onDelete, currentUser }) => {
  if (loading) {
    return (
      <div className="sm:hidden flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="sm:hidden space-y-4">
      {data.map((item) => {
        const isCurrentUser = currentUser?.username === item.username;
        
        return (
          <Card key={item.id} className={`overflow-hidden hover:shadow-md transition-shadow ${isCurrentUser ? 'bg-blue-50/50' : ''}`}>
            <CardBody className="p-4">
              <div className="mb-2">
                <div className="flex items-center">
                  <h3 className="text-lg font-bold text-gray-900">{item.username}</h3>
                  {isCurrentUser && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      (You)
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{item.full_name}</p>
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  Created: {formatDate(item.created_at)}
                </span>
                <div className="flex space-x-4">
                  <button 
                    onClick={() => onView(item)}
                    className="text-xs font-medium text-blue-600"
                  >
                    View
                  </button>
                  {isCurrentUser ? (
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider cursor-not-allowed">
                      Delete
                    </span>
                  ) : (
                    <button 
                      onClick={() => onDelete(item)}
                      className="text-xs font-medium text-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
};

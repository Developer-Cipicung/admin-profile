import React from 'react';
import { useNavigate } from 'react-router';
import { formatDate } from '../../utils/date';
import { formatCurrency } from '../../utils/currency';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const ProductTable = ({ data, loading, onView, onDelete }) => {
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 flex justify-center items-center hidden lg:flex">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="hidden lg:block bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produk
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Harga
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dibuat Pada
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Diperbarui Pada
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-12 w-12 flex-shrink-0">
                      <img 
                        src={import.meta.env.VITE_API_URL.replace('/api/v1', '') + (item.image_url || '/uploads/default-product.png')} 
                        alt={item.name} 
                        className="h-12 w-12 object-cover rounded bg-gray-100 border border-gray-200"
                        onError={(e) => { e.target.src = '/placeholder.png' }}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{item.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-medium">{formatCurrency(item.price)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(item.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(item.updated_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button 
                    onClick={() => onView(item)}
                    className="text-blue-600 hover:text-blue-900 font-medium"
                  >
                    Lihat
                  </button>
                  <button 
                    onClick={() => navigate(`/products/${item.id}/edit`)}
                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => onDelete(item)}
                    className="text-red-600 hover:text-red-900 font-medium"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

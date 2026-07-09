import React from 'react';
import { Link } from 'react-router';
import { formatDate } from '../../utils/date';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const NewsTable = ({ data, loading, onView, onDelete }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 flex justify-center items-center hidden lg:flex">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hidden lg:block">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
              Gambar
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Judul
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
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <img 
                  src={import.meta.env.VITE_API_URL.replace('/api/v1', '') + item.thumbnail_url} 
                  alt={item.title} 
                  className="h-12 w-16 object-cover rounded bg-gray-100"
                  onError={(e) => { e.target.src = '/placeholder.png' }}
                />
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900 line-clamp-2">{item.title}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(item.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(item.updated_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                <Link 
                  to={`/news/${item.id}`}
                  className="text-blue-600 hover:text-blue-900 font-medium"
                >
                  Lihat
                </Link>
                <Link to={`/news/${item.id}/edit`} className="text-indigo-600 hover:text-indigo-900 font-medium">Edit</Link>
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
  );
};

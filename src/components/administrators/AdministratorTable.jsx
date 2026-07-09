import React from 'react';
import { formatDate } from '../../utils/date';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const AdministratorTable = ({ data, loading, onView, onDelete, currentUser }) => {
  if (loading) {
    return (
      <div className="hidden sm:flex overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm p-12 justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="hidden sm:block overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama Pengguna
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama Lengkap
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
          {data.map((item) => {
            const isCurrentUser = currentUser?.username === item.username;
            
            return (
              <tr key={item.id} className={isCurrentUser ? "bg-blue-50/50 hover:bg-blue-50 transition-colors" : "hover:bg-gray-50 transition-colors"}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                  {item.username}
                  {isCurrentUser && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      (Anda)
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.full_name}
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
                  {isCurrentUser ? (
                    <span className="text-gray-400 font-medium cursor-not-allowed text-xs uppercase tracking-wider" title="Tidak dapat menghapus diri sendiri">
                      Hapus
                    </span>
                  ) : (
                    <button 
                      onClick={() => onDelete(item)}
                      className="text-red-600 hover:text-red-900 font-medium"
                    >
                      Hapus
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

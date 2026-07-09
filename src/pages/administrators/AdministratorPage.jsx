import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useAdministrators } from '../../hooks/useAdministrators';
import { useDeleteAdministrator } from '../../hooks/useDeleteAdministrator';
import { ADMINISTRATOR_CONSTANTS } from '../../constants/administrator.constants';
import { FilterToolbar } from '../../components/common/FilterToolbar';
import { Pagination } from '../../components/common/Pagination';
import { Button } from '../../components/common/Button';
import { ViewDetailsModal } from '../../components/common/ViewDetailsModal';
import { DeleteConfirmationModal } from '../../components/common/DeleteConfirmationModal';
import { formatDate } from '../../utils/date';
import { handlePaginationAfterDelete } from '../../utils/paginationHelper';

import { AdministratorTable } from '../../components/administrators/AdministratorTable';
import { AdministratorCard } from '../../components/administrators/AdministratorCard';
import { useNavigate } from 'react-router';

export const AdministratorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin } = useAuth();
  const [itemToView, setItemToView] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const {
    administrators,
    pagination,
    filters,
    loading,
    error,
    refresh,
    setPage,
    setSearch,
    setSort,
  } = useAdministrators();

  const { deleting, serverError, deleteAdministrator } = useDeleteAdministrator();

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    
    const success = await deleteAdministrator(itemToDelete.id);
    if (success) {
      setSuccessMsg(`Admin "${itemToDelete.username}" berhasil dihapus.`);
      setItemToDelete(null);
      
      handlePaginationAfterDelete({
        itemsLength: administrators.length,
        currentPage: pagination.page,
        setPage,
        refresh
      });
      
      setTimeout(() => {
        setSuccessMsg('');
      }, 4000);
    }
  };

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMsg(location.state.successMessage);
      
      // Clear the message from history state so it doesn't reappear on refresh
      window.history.replaceState({}, document.title);
      
      const timer = setTimeout(() => {
        setSuccessMsg('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleSearchChange = (val) => {
    setSearchInput(val);
    setSearch(val);
    setSuccessMsg('');
  };

  const isEmpty = !loading && !error && administrators.length === 0;

  return (
    <div className="space-y-6 relative">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Admin</h2>
          <p className="mt-1 text-sm text-gray-500">Kelola admin dashboard dan aksesnya.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <Button onClick={() => navigate('/administrators/create')} variant="primary">Buat Admin</Button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-800 transition-all">
          <svg className="w-5 h-5 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
          <span className="text-sm font-medium">{successMsg}</span>
        </div>
      )}

      <FilterToolbar
        searchPlaceholder="Cari admin..."
        searchValue={searchInput}
        onSearchChange={handleSearchChange}
        sortValue={filters.sort}
        onSortChange={setSort}
        sortOptions={ADMINISTRATOR_CONSTANTS.SORT_OPTIONS}
        onRefresh={refresh}
        disabled={loading && administrators.length === 0}
      />

      {error ? (
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 flex flex-col items-center justify-center text-center">
          <p className="text-red-800 font-medium mb-2">{error}</p>
          <Button variant="secondary" onClick={refresh}>Coba Lagi</Button>
        </div>
      ) : isEmpty ? (
        <div className="bg-white p-12 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-center">
          <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Admin tidak ditemukan</h3>
          <p className="text-gray-500">Coba sesuaikan filter pencarian Anda.</p>
        </div>
      ) : (
        <>
          <AdministratorTable 
            data={administrators} 
            loading={loading} 
            onView={setItemToView}
            onDelete={setItemToDelete}
            currentUser={admin}
          />
          <AdministratorCard 
            data={administrators} 
            loading={loading} 
            onView={setItemToView}
            onDelete={setItemToDelete}
            currentUser={admin}
          />
          
          {pagination?.totalPages > 1 && (
            <div className="mt-6">
              <Pagination 
                pagination={pagination} 
                onPageChange={setPage} 
                disabled={loading}
              />
            </div>
          )}
        </>
      )}

      <DeleteConfirmationModal
        open={!!itemToDelete}
        title="Hapus Admin"
        message={itemToDelete ? `Apakah Anda yakin ingin menghapus admin "${itemToDelete.username}"? Tindakan ini tidak dapat dibatalkan.` : ''}
        loading={deleting}
        serverError={serverError}
        onConfirm={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
      />

      <ViewDetailsModal
        open={!!itemToView}
        title="Detail Admin"
        fields={itemToView ? [
          { label: 'Nama Pengguna', value: itemToView.username, fullWidth: true },
          { label: 'Nama Lengkap', value: itemToView.full_name, fullWidth: true },
          { label: 'Dibuat Pada', value: formatDate(itemToView.created_at) },
          { label: 'Diperbarui Pada', value: formatDate(itemToView.updated_at) },
        ] : []}
        onClose={() => setItemToView(null)}
      />
    </div>
  );
};

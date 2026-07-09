import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useNews } from '../../hooks/useNews';
import { useDeleteNews } from '../../hooks/useDeleteNews';
import { NEWS_CONSTANTS } from '../../constants/news.constants';
import { FilterToolbar } from '../../components/common/FilterToolbar';
import { NewsTable } from '../../components/news/NewsTable';
import { NewsCard } from '../../components/news/NewsCard';
import { Pagination } from '../../components/common/Pagination';
import { Button } from '../../components/common/Button';
import { DeleteConfirmationModal } from '../../components/common/DeleteConfirmationModal';
import { handlePaginationAfterDelete } from '../../utils/paginationHelper';

export const NewsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchInput, setSearchInput] = useState('');
  const [itemToDelete, setItemToDelete] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  
  const {
    news,
    pagination,
    filters,
    loading,
    error,
    refresh,
    setPage,
    setSearch,
    setSort,
  } = useNews();

  const { deleting, serverError, deleteNews } = useDeleteNews();

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
    setSuccessMsg(''); // Clear success message on new search
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    
    const success = await deleteNews(itemToDelete.id);
    if (success) {
      setSuccessMsg(`"${itemToDelete.title}" berhasil dihapus.`);
      setItemToDelete(null);
      
      handlePaginationAfterDelete({
        itemsLength: news.length,
        currentPage: pagination.page,
        setPage,
        refresh
      });
      
      // Hide success message after a few seconds
      setTimeout(() => {
        setSuccessMsg('');
      }, 4000);
    }
  };

  const isEmpty = !loading && !error && news.length === 0;

  return (
    <div className="space-y-6 relative">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Berita</h2>
          <p className="mt-1 text-sm text-gray-500">Kelola berita dan pengumuman desa.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <Button onClick={() => navigate('/news/create')} variant="primary">Buat Berita</Button>
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
        searchPlaceholder="Cari judul berita..."
        searchValue={searchInput}
        onSearchChange={handleSearchChange}
        sortValue={filters.sort}
        onSortChange={setSort}
        sortOptions={NEWS_CONSTANTS.SORT_OPTIONS}
        onRefresh={refresh}
        disabled={loading && news.length === 0}
      />

      {error ? (
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 flex flex-col items-center justify-center text-center">
          <p className="text-red-800 font-medium mb-2">{error}</p>
          <Button variant="secondary" onClick={refresh}>Coba Lagi</Button>
        </div>
      ) : isEmpty ? (
        <div className="bg-white p-12 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-center">
          <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5L18.5 5H15m-4 4h.01M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Berita tidak ditemukan</h3>
          <p className="text-gray-500">Coba sesuaikan filter pencarian Anda atau buat berita baru.</p>
        </div>
      ) : (
        <>
          <NewsTable 
            data={news} 
            loading={loading} 
            onDelete={(item) => setItemToDelete(item)} 
          />
          <NewsCard 
            data={news} 
            loading={loading} 
            onDelete={(item) => setItemToDelete(item)} 
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
        title="Hapus Berita"
        message={itemToDelete ? `Apakah Anda yakin ingin menghapus "${itemToDelete.title}"? Tindakan ini tidak dapat dibatalkan.` : ''}
        loading={deleting}
        serverError={serverError}
        onConfirm={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
};

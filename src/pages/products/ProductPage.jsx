import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useProducts } from '../../hooks/useProducts';
import { useDeleteProduct } from '../../hooks/useDeleteProduct';
import { PRODUCT_CONSTANTS } from '../../constants/product.constants';
import { FilterToolbar } from '../../components/common/FilterToolbar';
import { ProductTable } from '../../components/products/ProductTable';
import { ProductCard } from '../../components/products/ProductCard';
import { Pagination } from '../../components/common/Pagination';
import { Button } from '../../components/common/Button';
import { ViewDetailsModal } from '../../components/common/ViewDetailsModal';
import { DeleteConfirmationModal } from '../../components/common/DeleteConfirmationModal';
import { formatDate } from '../../utils/date';
import { formatCurrency } from '../../utils/currency';
import { handlePaginationAfterDelete } from '../../utils/paginationHelper';

export const ProductPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchInput, setSearchInput] = useState('');
  const [itemToView, setItemToView] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  
  const {
    products,
    pagination,
    filters,
    loading,
    error,
    refresh,
    setPage,
    setSearch,
    setSort,
  } = useProducts();

  const { deleting, serverError, deleteProduct } = useDeleteProduct();

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

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    
    const success = await deleteProduct(itemToDelete.id);
    if (success) {
      setSuccessMsg(`"${itemToDelete.name}" berhasil dihapus.`);
      setItemToDelete(null);
      
      handlePaginationAfterDelete({
        itemsLength: products.length,
        currentPage: pagination.page,
        setPage,
        refresh
      });
      
      setTimeout(() => {
        setSuccessMsg('');
      }, 4000);
    }
  };

  const isEmpty = !loading && !error && products.length === 0;

  return (
    <div className="space-y-6 relative">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Katalog Produk</h2>
          <p className="mt-1 text-sm text-gray-500">Kelola produk UMKM untuk katalog desa.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <Button onClick={() => navigate('/products/create')} variant="primary">Buat Produk</Button>
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
        searchPlaceholder="Cari nama produk..."
        searchValue={searchInput}
        onSearchChange={handleSearchChange}
        sortValue={filters.sort}
        onSortChange={setSort}
        sortOptions={PRODUCT_CONSTANTS.SORT_OPTIONS}
        onRefresh={refresh}
        disabled={loading && products.length === 0}
      />

      {error ? (
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 flex flex-col items-center justify-center text-center">
          <p className="text-red-800 font-medium mb-2">{error}</p>
          <Button variant="secondary" onClick={refresh}>Coba Lagi</Button>
        </div>
      ) : isEmpty ? (
        <div className="bg-white p-12 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-center">
          <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Produk tidak ditemukan</h3>
          <p className="text-gray-500">Coba sesuaikan filter pencarian Anda atau buat produk baru.</p>
        </div>
      ) : (
        <>
          <ProductTable 
            data={products} 
            loading={loading} 
            onView={(item) => setItemToView(item)} 
            onDelete={(item) => setItemToDelete(item)}
          />
          <ProductCard 
            data={products} 
            loading={loading} 
            onView={(item) => setItemToView(item)} 
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
        title="Hapus Produk"
        message={itemToDelete ? `Apakah Anda yakin ingin menghapus "${itemToDelete.name}"? Tindakan ini tidak dapat dibatalkan.` : ''}
        loading={deleting}
        serverError={serverError}
        onConfirm={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
      />

      <ViewDetailsModal
        open={!!itemToView}
        title="Detail Produk"
        image={import.meta.env.VITE_API_URL.replace('/api/v1', '') + (itemToView?.image_url || '/uploads/default-product.png')}
        fields={itemToView ? [
          { label: 'Nama', value: itemToView.name, fullWidth: true },
          { label: 'Deskripsi', value: itemToView.description, fullWidth: true },
          { label: 'Harga', value: formatCurrency(itemToView.price) },
          { label: 'Dibuat Pada', value: formatDate(itemToView.created_at) },
          { label: 'Diperbarui Pada', value: formatDate(itemToView.updated_at) },
        ] : []}
        onClose={() => setItemToView(null)}
      />
    </div>
  );
};

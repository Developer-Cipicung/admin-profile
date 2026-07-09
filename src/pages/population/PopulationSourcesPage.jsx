import React, { useState } from 'react';
import { usePopulationSources } from '../../hooks/usePopulationSources';
import { PopulationSourceTable } from '../../components/population/PopulationSourceTable';
import { PopulationSourceCard } from '../../components/population/PopulationSourceCard';
import { PopulationSourceForm } from '../../components/population/PopulationSourceForm';
import { FilterToolbar } from '../../components/common/FilterToolbar';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { DeleteConfirmationModal } from '../../components/common/DeleteConfirmationModal';
import { ViewDetailsModal } from '../../components/common/ViewDetailsModal';
import { Button } from '../../components/common/Button';
import { formatDate } from '../../utils/date';

export const PopulationSourcesPage = () => {
  const {
    sources,
    loading,
    error,
    isCrawling,
    pagination,
    fetchSources,
    createSource,
    updateSource,
    deleteSource,
    activateSource,
    crawlSource
  } = usePopulationSources();

  // Filter state
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isActivateOpen, setIsActivateOpen] = useState(false);
  const [isCrawlOpen, setIsCrawlOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  
  // Action state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [crawlSummary, setCrawlSummary] = useState(null);

  // Initial fetch effect
  React.useEffect(() => {
    fetchSources({ search, sortBy, sortOrder, page: 1 });
  }, [fetchSources]);

  // Handlers
  const handleFilterChange = ({ search, sortBy, sortOrder }) => {
    setSearch(search);
    setSortBy(sortBy);
    setSortOrder(sortOrder);
    fetchSources({ search, sortBy, sortOrder, page: 1 });
  };

  const handlePageChange = (page) => {
    fetchSources({ search, sortBy, sortOrder, page });
  };

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    setActionError(null);
    try {
      if (selectedSource) {
        await updateSource(selectedSource.id, data);
      } else {
        await createSource(data);
      }
      setIsFormOpen(false);
      fetchSources({ search, sortBy, sortOrder, page: pagination.currentPage });
    } catch (err) {
      setActionError(err.message || 'Failed to save source.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsSubmitting(true);
    setActionError(null);
    try {
      await deleteSource(selectedSource.id);
      setIsDeleteOpen(false);
      fetchSources({ search, sortBy, sortOrder, page: pagination.currentPage });
    } catch (err) {
      setActionError(err.message || 'Failed to delete source.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActivateConfirm = async () => {
    setIsSubmitting(true);
    setActionError(null);
    try {
      await activateSource(selectedSource.id);
      setIsActivateOpen(false);
      fetchSources({ search, sortBy, sortOrder, page: pagination.currentPage });
    } catch (err) {
      setActionError(err.message || 'Failed to activate source.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCrawlConfirm = async () => {
    setActionError(null);
    setCrawlSummary(null);
    try {
      const result = await crawlSource(selectedSource.id);
      setIsCrawlOpen(false);
      setCrawlSummary(result);
      // Automatically refresh the table after successful crawl to show new metadata
      fetchSources({ search, sortBy, sortOrder, page: pagination.currentPage });
    } catch (err) {
      setActionError(err.message || 'Failed to crawl spreadsheet.');
      // Refresh to update status to Failed if it failed
      fetchSources({ search, sortBy, sortOrder, page: pagination.currentPage });
    }
  };

  const sortOptions = [
    { value: 'name', label: 'Spreadsheet Name' },
    { value: 'created_at', label: 'Created At' },
    { value: 'updated_at', label: 'Updated At' },
    { value: 'is_active', label: 'Status' },
  ];

  const viewFields = selectedSource ? [
    { label: 'Spreadsheet Name', value: selectedSource.name, fullWidth: true },
    { label: 'Spreadsheet URL', value: selectedSource.spreadsheet_url, fullWidth: true },
    { label: 'Worksheet Name', value: selectedSource.worksheet_name },
    { label: 'Active Status', value: selectedSource.is_active ? 'Active' : 'Inactive' },
    { label: 'Last Crawl Time', value: selectedSource.last_crawled_at ? formatDate(selectedSource.last_crawled_at) : 'Never Crawled' },
    { label: 'Last Crawl Status', value: selectedSource.last_crawl_status || '-' },
    { label: 'Created At', value: formatDate(selectedSource.created_at) },
    { label: 'Updated At', value: formatDate(selectedSource.updated_at) }
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Sumber Data Penduduk</h2>
        <Button onClick={() => {
          setSelectedSource(null);
          setActionError(null);
          setIsFormOpen(true);
        }}>
          Tambah Sumber
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {crawlSummary && (
        <div className="bg-green-50 p-4 rounded-md border border-green-200 shadow-sm relative">
          <button onClick={() => setCrawlSummary(null)} className="absolute top-2 right-2 text-green-700 hover:text-green-900">
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </button>
          <h3 className="text-green-800 font-medium">Berhasil menarik data!</h3>
          <div className="mt-2 text-sm text-green-700 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <p><strong>Bulan Diproses:</strong> {crawlSummary.months_processed}</p>
            <p><strong>Status:</strong> {crawlSummary.message}</p>
          </div>
        </div>
      )}

      <FilterToolbar
        onFilterChange={handleFilterChange}
        searchPlaceholder="Cari sumber data..."
        sortOptions={sortOptions}
        defaultSortBy="created_at"
        defaultSortOrder="desc"
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : sources.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Belum ada sumber data</h3>
          <p className="mt-1 text-sm text-gray-500">
            {search ? 'Coba gunakan kata kunci pencarian lain.' : 'Mulai dengan menambahkan link spreadsheet penduduk baru.'}
          </p>
        </div>
      ) : (
        <>
          <PopulationSourceTable
            sources={sources}
            isCrawling={isCrawling}
            onView={(s) => { setSelectedSource(s); setIsViewOpen(true); }}
            onEdit={(s) => { setSelectedSource(s); setActionError(null); setIsFormOpen(true); }}
            onDelete={(s) => { setSelectedSource(s); setActionError(null); setIsDeleteOpen(true); }}
            onActivate={(s) => { setSelectedSource(s); setActionError(null); setIsActivateOpen(true); }}
            onCrawl={(s) => { setSelectedSource(s); setActionError(null); setCrawlSummary(null); setIsCrawlOpen(true); }}
          />

          <div className="md:hidden">
            {sources.map(source => (
              <PopulationSourceCard
                key={source.id}
                source={source}
                isCrawling={isCrawling}
                onView={(s) => { setSelectedSource(s); setIsViewOpen(true); }}
                onEdit={(s) => { setSelectedSource(s); setActionError(null); setIsFormOpen(true); }}
                onDelete={(s) => { setSelectedSource(s); setActionError(null); setIsDeleteOpen(true); }}
                onActivate={(s) => { setSelectedSource(s); setActionError(null); setIsActivateOpen(true); }}
                onCrawl={(s) => { setSelectedSource(s); setActionError(null); setCrawlSummary(null); setIsCrawlOpen(true); }}
              />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      <Modal
        open={isFormOpen}
        onClose={() => !isSubmitting && setIsFormOpen(false)}
        title={selectedSource ? 'Edit Sumber Data' : 'Tambah Sumber Data'}
      >
        {actionError && (
          <div className="mb-4 bg-red-50 p-3 rounded-md">
            <p className="text-sm text-red-700">{actionError}</p>
          </div>
        )}
        <PopulationSourceForm
          initialData={selectedSource}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={isDeleteOpen}
        onClose={() => !isSubmitting && setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Sumber Data"
        message={`Apakah Anda yakin ingin menghapus "${selectedSource?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        isDeleting={isSubmitting}
        error={actionError}
      />

      {/* Activate Confirmation Modal */}
      <Modal
        open={isActivateOpen}
        onClose={() => !isSubmitting && setIsActivateOpen(false)}
        title="Aktifkan Sumber Data"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Apakah Anda yakin ingin mengaktifkan <strong>{selectedSource?.name}</strong>?
          </p>
          <p className="text-sm text-gray-500">
            Ini akan menonaktifkan sumber data yang sedang aktif saat ini. Sistem akan menggunakan sumber data ini untuk sinkronisasi berikutnya.
          </p>
          {actionError && (
            <div className="bg-red-50 p-3 rounded-md">
              <p className="text-sm text-red-700">{actionError}</p>
            </div>
          )}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsActivateOpen(false)}>
              Batal
            </Button>
            <Button type="button" onClick={handleActivateConfirm} isLoading={isSubmitting}>
              Aktifkan
            </Button>
          </div>
        </div>
      </Modal>

      {/* Crawl Confirmation Modal */}
      <Modal
        open={isCrawlOpen}
        onClose={() => !isCrawling && setIsCrawlOpen(false)}
        title="Tarik Data Penduduk"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Tarik data penduduk terbaru dari <strong>{selectedSource?.name}</strong>?
          </p>
          <p className="text-sm text-gray-500">
            Tindakan ini akan membaca worksheet <strong>"{selectedSource?.worksheet_name || 'CIPICUNG'}"</strong> dan otomatis menyinkronkan seluruh data bulanan ke database.
          </p>
          {actionError && (
            <div className="bg-red-50 p-3 rounded-md">
              <p className="text-sm text-red-700">{actionError}</p>
            </div>
          )}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={() => setIsCrawlOpen(false)} disabled={isCrawling}>
              Batal
            </Button>
            <Button type="button" onClick={handleCrawlConfirm} isLoading={isCrawling}>
              Mulai Tarik Data
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Details Modal */}
      <ViewDetailsModal
        open={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Detail Sumber Data"
        fields={viewFields}
      />
    </div>
  );
};

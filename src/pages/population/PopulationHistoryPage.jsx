import React, { useState, useEffect } from 'react';
import { usePopulationHistory } from '../../hooks/usePopulationHistory';
import { PopulationHistoryTable } from '../../components/population/PopulationHistoryTable';
import { PopulationHistoryCard } from '../../components/population/PopulationHistoryCard';
import { FilterToolbar } from '../../components/common/FilterToolbar';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { DeleteConfirmationModal } from '../../components/common/DeleteConfirmationModal';
import { ViewDetailsModal } from '../../components/common/ViewDetailsModal';
import { Card, CardBody } from '../../components/common/Card';
import { formatDate } from '../../utils/date';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const PopulationHistoryPage = () => {
  const {
    history,
    trends,
    loading,
    error,
    pagination,
    fetchHistory,
    fetchTrends,
    getSnapshotDetails,
    deleteSnapshot
  } = usePopulationHistory();

  // Filter state
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('year');
  const [sortOrder, setSortOrder] = useState('desc');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  // Modal states
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);
  const [snapshotDetails, setSnapshotDetails] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchHistory({ search, sortBy, sortOrder, month: monthFilter, year: yearFilter, page: 1 });
    fetchTrends(); // optionally pass year filter if needed later
  }, [fetchHistory, fetchTrends]);

  const handleFilterChange = ({ search, sortBy, sortOrder }) => {
    setSearch(search);
    setSortBy(sortBy);
    setSortOrder(sortOrder);
    fetchHistory({ search, sortBy, sortOrder, month: monthFilter, year: yearFilter, page: 1 });
  };

  const handlePageChange = (page) => {
    fetchHistory({ search, sortBy, sortOrder, month: monthFilter, year: yearFilter, page });
  };

  const handleView = async (snapshot) => {
    setSelectedSnapshot(snapshot);
    setSnapshotDetails(null);
    setIsViewOpen(true);
    setDetailsLoading(true);
    try {
      const fullData = await getSnapshotDetails(snapshot.id);
      setSnapshotDetails(fullData.details);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsSubmitting(true);
    setActionError(null);
    try {
      await deleteSnapshot(selectedSnapshot.id);
      setIsDeleteOpen(false);
      fetchHistory({ search, sortBy, sortOrder, month: monthFilter, year: yearFilter, page: pagination.currentPage });
      fetchTrends();
    } catch (err) {
      setActionError(err.message || 'Failed to delete snapshot.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sortOptions = [
    { value: 'year', label: 'Date (Year/Month)' },
    { value: 'current_population', label: 'Population Size' },
    { value: 'imported_at', label: 'Import Time' }
  ];

  const viewFields = selectedSnapshot ? [
    { label: 'Month/Year', value: `${selectedSnapshot.month}/${selectedSnapshot.year}` },
    { label: 'Imported At', value: formatDate(selectedSnapshot.imported_at) },
    { label: 'Current Population', value: selectedSnapshot.current_population },
    { label: 'Net Growth', value: (selectedSnapshot.birth_total + selectedSnapshot.move_in_total - selectedSnapshot.death_total - selectedSnapshot.move_out_total) },
    { label: 'Total Births', value: selectedSnapshot.birth_total },
    { label: 'Total Deaths', value: selectedSnapshot.death_total },
    { label: 'Total Move In', value: selectedSnapshot.move_in_total },
    { label: 'Total Move Out', value: selectedSnapshot.move_out_total },
    { label: 'Source Spreadsheet', value: selectedSnapshot.source?.name || 'Unknown', fullWidth: true }
  ] : [];

  // Chart data formatting
  const chartData = [...trends].map(t => ({
    name: `${t.month}/${t.year}`,
    Population: t.current_population,
    Births: t.birth_total,
    Deaths: t.death_total,
    MoveIn: t.move_in_total,
    MoveOut: t.move_out_total,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Population History & Analytics</h2>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Analytics Charts */}
      {trends.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-1 lg:col-span-2">
            <CardBody className="p-4 h-80">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Total Population Trend</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Population" stroke="#3b82f6" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4 h-80">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Births vs Deaths</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Births" fill="#10b981" />
                  <Bar dataKey="Deaths" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4 h-80">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Move In vs Move Out</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="MoveIn" fill="#10b981" />
                  <Bar dataKey="MoveOut" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </div>
      )}

      <FilterToolbar
        onFilterChange={handleFilterChange}
        searchPlaceholder="Search history..."
        sortOptions={sortOptions}
        defaultSortBy="year"
        defaultSortOrder="desc"
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">No historical data</h3>
          <p className="mt-1 text-sm text-gray-500">
            Crawl a population source to generate historical snapshots.
          </p>
        </div>
      ) : (
        <>
          <PopulationHistoryTable
            history={history}
            onView={handleView}
            onDelete={(s) => { setSelectedSnapshot(s); setActionError(null); setIsDeleteOpen(true); }}
            latestSnapshotId={trends.length > 0 ? trends[trends.length - 1].id : null}
          />

          <div className="md:hidden">
            {history.map(snapshot => (
              <PopulationHistoryCard
                key={snapshot.id}
                snapshot={snapshot}
                onView={handleView}
                onDelete={(s) => { setSelectedSnapshot(s); setActionError(null); setIsDeleteOpen(true); }}
                latestSnapshotId={trends.length > 0 ? trends[trends.length - 1].id : null}
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

      {/* Delete Confirmation */}
      <DeleteConfirmationModal
        open={isDeleteOpen}
        onCancel={() => !isSubmitting && setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Snapshot"
        message={`Are you sure you want to delete the snapshot for ${selectedSnapshot?.month}/${selectedSnapshot?.year}? This will also delete all RT/RW details. This action cannot be undone.`}
        isDeleting={isSubmitting}
        error={actionError}
      />

      {/* View Details Modal with RT/RW table */}
      <ViewDetailsModal
        open={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Snapshot Details"
        fields={viewFields}
      >
        {detailsLoading ? (
          <div className="flex justify-center py-4">
            <LoadingSpinner size="sm" />
          </div>
        ) : snapshotDetails && snapshotDetails.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">RT/RW Breakdown</h4>
            <div className="overflow-x-auto border border-gray-200 rounded-md max-h-64 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RW</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RT</th>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Pop</th>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Birth</th>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Death</th>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">In</th>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Out</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {snapshotDetails.map((detail) => (
                    <tr key={detail.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm text-gray-500">{detail.rw}</td>
                      <td className="px-3 py-2 text-sm text-gray-500">{detail.rt}</td>
                      <td className="px-3 py-2 text-sm font-medium text-gray-900 text-right">{detail.current_population}</td>
                      <td className="px-3 py-2 text-sm text-green-600 text-right">+{detail.birth_count}</td>
                      <td className="px-3 py-2 text-sm text-red-600 text-right">-{detail.death_count}</td>
                      <td className="px-3 py-2 text-sm text-green-600 text-right">+{detail.move_in_count}</td>
                      <td className="px-3 py-2 text-sm text-red-600 text-right">-{detail.move_out_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-4">No detailed RT/RW breakdown found for this snapshot.</p>
        )}
      </ViewDetailsModal>
    </div>
  );
};

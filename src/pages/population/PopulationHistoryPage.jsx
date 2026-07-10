import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { usePopulationHistory } from "../../hooks/usePopulationHistory";
import { PopulationHistoryTable } from "../../components/population/PopulationHistoryTable";
import { PopulationHistoryCard } from "../../components/population/PopulationHistoryCard";
import { FilterToolbar } from "../../components/common/FilterToolbar";
import { Pagination } from "../../components/common/Pagination";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { DeleteConfirmationModal } from "../../components/common/DeleteConfirmationModal";
import { ViewDetailsModal } from "../../components/common/ViewDetailsModal";
import { Card, CardBody } from "../../components/common/Card";
import { formatDate } from "../../utils/date";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const netGrowth = data.Births + data.MoveIn - data.Deaths - data.MoveOut;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded shadow-sm text-sm z-50">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        <p className="text-gray-700">Total: <span className="font-medium text-blue-600">{new Intl.NumberFormat('id-ID').format(data.Population)}</span></p>
        <p className="text-gray-700">Lahir: <span className="font-medium text-green-600">+{new Intl.NumberFormat('id-ID').format(data.Births)}</span></p>
        <p className="text-gray-700">Mati: <span className="font-medium text-red-600">-{new Intl.NumberFormat('id-ID').format(data.Deaths)}</span></p>
        <p className="text-gray-700">Masuk: <span className="font-medium text-green-600">+{new Intl.NumberFormat('id-ID').format(data.MoveIn)}</span></p>
        <p className="text-gray-700">Keluar: <span className="font-medium text-red-600">-{new Intl.NumberFormat('id-ID').format(data.MoveOut)}</span></p>
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-gray-700">Net: <span className={`font-medium ${netGrowth > 0 ? 'text-green-600' : netGrowth < 0 ? 'text-red-600' : 'text-gray-900'}`}>{netGrowth > 0 ? '+' : ''}{new Intl.NumberFormat('id-ID').format(netGrowth)}</span></p>
        </div>
      </div>
    );
  }
  return null;
};

export const PopulationHistoryPage = () => {
  const {
    history,
    trends,
    loading,
    error,
    pagination,
    availableFilters,
    yearlyCounts,
    fetchHistory,
    fetchTrends,
    fetchFilters,
    getSnapshotDetails,
    deleteSnapshot,
  } = usePopulationHistory();

  const [searchParams, setSearchParams] = useSearchParams();

  // Filter state derived from URL
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "year";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const monthFilter = searchParams.get("month") || "";
  const yearFilter = searchParams.get("year") || "";
  const sourceFilter = searchParams.get("source_id") || "";
  const pageFilter = searchParams.get("page") || "1";

  const updateParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    setSearchParams(params);
  };

  // Modal states
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);
  const [snapshotDetails, setSnapshotDetails] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  useEffect(() => {
    fetchHistory({
      search,
      sortBy,
      sortOrder,
      month: monthFilter,
      year: yearFilter,
      source_id: sourceFilter,
      page: parseInt(pageFilter, 10),
    });
    fetchTrends({ year: yearFilter, source_id: sourceFilter });
  }, [fetchHistory, fetchTrends, search, sortBy, sortOrder, monthFilter, yearFilter, sourceFilter, pageFilter]);

  const handleFilterChange = ({ search: newSearch, sortBy: newSortBy, sortOrder: newSortOrder }) => {
    updateParams({ search: newSearch, sortBy: newSortBy, sortOrder: newSortOrder, page: "1" });
  };

  const handlePageChange = (page) => {
    updateParams({ page: page.toString() });
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
      fetchHistory({
        search,
        sortBy,
        sortOrder,
        month: monthFilter,
        year: yearFilter,
        page: pagination.currentPage,
      });
      fetchTrends();
    } catch (err) {
      setActionError(err.message || "Failed to delete snapshot.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sortOptions = [
    { value: "year", label: "Date (Year/Month)" },
    { value: "current_population", label: "Population Size" },
    { value: "imported_at", label: "Import Time" },
  ];

  const viewFields = selectedSnapshot
    ? [
        {
          label: "Month/Year",
          value: `${selectedSnapshot.month}/${selectedSnapshot.year}`,
        },
        {
          label: "Imported At",
          value: formatDate(selectedSnapshot.imported_at),
        },
        {
          label: "Current Population",
          value: selectedSnapshot.current_population,
        },
        {
          label: "Net Growth",
          value:
            selectedSnapshot.birth_total +
            selectedSnapshot.move_in_total -
            selectedSnapshot.death_total -
            selectedSnapshot.move_out_total,
        },
        { label: "Total Births", value: selectedSnapshot.birth_total },
        { label: "Total Deaths", value: selectedSnapshot.death_total },
        { label: "Total Move In", value: selectedSnapshot.move_in_total },
        { label: "Total Move Out", value: selectedSnapshot.move_out_total },
        {
          label: "Source Spreadsheet",
          value: selectedSnapshot.source?.name || "Unknown",
          fullWidth: true,
        },
      ]
    : [];

  // Chart data formatting
  const chartData = [...trends].map((t) => ({
    name: `${t.month}/${t.year}`,
    Population: t.current_population,
    Births: t.birth_total,
    Deaths: t.death_total,
    MoveIn: t.move_in_total,
    MoveOut: t.move_out_total,
  }));

  // Filter derivations
  const years = [...new Set(availableFilters.map(f => f.year))].sort((a,b) => b - a);
  const validMonths = availableFilters.filter(f => !yearFilter || f.year.toString() === yearFilter.toString());
  const months = [...new Set(validMonths.map(f => f.month))].sort((a,b) => a - b);
  const validSources = availableFilters.filter(f => 
    (!yearFilter || f.year.toString() === yearFilter.toString()) && 
    (!monthFilter || f.month.toString() === monthFilter.toString())
  );
  const sources = [...new Set(validSources.map(f => JSON.stringify({id: f.source_id, name: f.source?.name})))].map(s => JSON.parse(s));


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Riwayat & Analitik Penduduk
        </h2>
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
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Tren Total Penduduk
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={['auto', 'auto']} tickFormatter={(value) => new Intl.NumberFormat('id-ID').format(value)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Population"
                    stroke="#3b82f6"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4 h-80">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Kelahiran vs Kematian
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => new Intl.NumberFormat('id-ID').format(value)} />
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
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Pindah Masuk vs Keluar
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => new Intl.NumberFormat('id-ID').format(value)} />
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

      {/* Cascading Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
          <select value={yearFilter} onChange={(e) => updateParams({ year: e.target.value, month: "", source_id: "", page: "1" })} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
            <option value="">Semua Tahun</option>
            {years.map(y => <option key={y} value={y}>{y} ({yearlyCounts[y] || 0})</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
          <select value={monthFilter} onChange={(e) => updateParams({ month: e.target.value, source_id: "", page: "1" })} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
            <option value="">Semua Bulan</option>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sumber Data</label>
          <select value={sourceFilter} onChange={(e) => updateParams({ source_id: e.target.value, page: "1" })} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
            <option value="">Semua Sumber</option>
            {sources.map(s => <option key={s.id} value={s.id}>{s.name || "Unknown"}</option>)}
          </select>
        </div>
      </div>

      <FilterToolbar
        onFilterChange={handleFilterChange}
        searchPlaceholder="Cari riwayat..."
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
          <h3 className="text-lg font-medium text-gray-900">
            Belum ada riwayat data
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Tarik sumber data penduduk (Crawl) untuk menghasilkan riwayat data
            bulanan.
          </p>
        </div>
      ) : (
        <>
          <PopulationHistoryTable
            history={history}
            onView={handleView}
            onDelete={(s) => {
              setSelectedSnapshot(s);
              setActionError(null);
              setIsDeleteOpen(true);
            }}
            latestSnapshotId={
              trends.length > 0 ? trends[trends.length - 1].id : null
            }
          />

          <div className="md:hidden">
            {history.map((snapshot) => (
              <PopulationHistoryCard
                key={snapshot.id}
                snapshot={snapshot}
                onView={handleView}
                onDelete={(s) => {
                  setSelectedSnapshot(s);
                  setActionError(null);
                  setIsDeleteOpen(true);
                }}
                latestSnapshotId={
                  trends.length > 0 ? trends[trends.length - 1].id : null
                }
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
        title="Hapus Riwayat"
        message={`Apakah Anda yakin ingin menghapus data bulan ${selectedSnapshot?.month}/${selectedSnapshot?.year}? Ini juga akan menghapus seluruh rincian RT/RW. Tindakan ini tidak dapat dibatalkan.`}
        isDeleting={isSubmitting}
        error={actionError}
      />

      {/* View Details Modal with RT/RW table */}
      <ViewDetailsModal
        open={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Detail Riwayat Data"
        fields={viewFields}
      >
        {detailsLoading ? (
          <div className="flex justify-center py-4">
            <LoadingSpinner size="sm" />
          </div>
        ) : snapshotDetails && snapshotDetails.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Rincian RT/RW
            </h4>
            <div className="overflow-x-auto border border-gray-200 rounded-md max-h-64 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      RW
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      RT
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Pop
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Lahir
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Mati
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Masuk
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Keluar
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {snapshotDetails.map((detail) => (
                    <tr key={detail.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm text-gray-500">
                        {detail.rw}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-500">
                        {detail.rt}
                      </td>
                      <td className="px-3 py-2 text-sm font-medium text-gray-900 text-right">
                        {detail.current_population}
                      </td>
                      <td className="px-3 py-2 text-sm text-green-600 text-right">
                        +{detail.birth_count}
                      </td>
                      <td className="px-3 py-2 text-sm text-red-600 text-right">
                        -{detail.death_count}
                      </td>
                      <td className="px-3 py-2 text-sm text-green-600 text-right">
                        +{detail.move_in_count}
                      </td>
                      <td className="px-3 py-2 text-sm text-red-600 text-right">
                        -{detail.move_out_count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-4">
            Tidak ada rincian RT/RW untuk riwayat data ini.
          </p>
        )}
      </ViewDetailsModal>
    </div>
  );
};

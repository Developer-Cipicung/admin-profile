import React from 'react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { useNews } from '../../hooks/useNews';
import { useProducts } from '../../hooks/useProducts';
import { useAdministrators } from '../../hooks/useAdministrators';
import { usePopulationSummary } from '../../hooks/usePopulationSummary';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/date';

import { useAuth } from '../../contexts/AuthContext';
import { canManageNews, canManageProducts, canManageAdministrators, canManagePopulation } from '../../utils/permissions';

const NewsWidget = () => {
  const { pagination: newsPagination, loading: newsLoading } = useNews();
  const totalNews = newsPagination?.totalItems || 0;
  
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-medium text-gray-900">Total Berita</h3>
      </CardHeader>
      <CardBody>
        {newsLoading ? (
          <div className="h-9 w-16 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <p className="text-3xl font-bold text-blue-600">{totalNews}</p>
        )}
      </CardBody>
    </Card>
  );
};

const ProductsWidget = () => {
  const { pagination: productsPagination, loading: productsLoading } = useProducts();
  const totalProducts = productsPagination?.totalItems || 0;

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-medium text-gray-900">Total Produk</h3>
      </CardHeader>
      <CardBody>
        {productsLoading ? (
          <div className="h-9 w-16 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <p className="text-3xl font-bold text-green-600">{totalProducts}</p>
        )}
      </CardBody>
    </Card>
  );
};

const AdminWidget = () => {
  const { pagination: adminPagination, loading: adminLoading } = useAdministrators();
  const totalAdmins = adminPagination?.totalItems || 0;

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-medium text-gray-900">Total Admin</h3>
      </CardHeader>
      <CardBody>
        {adminLoading ? (
          <div className="h-9 w-16 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <p className="text-3xl font-bold text-purple-600">{totalAdmins}</p>
        )}
      </CardBody>
    </Card>
  );
};

const PopulationOverview = () => {
  const { summary: popSummary, loading: popLoading, error: popError } = usePopulationSummary();
  
  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center items-start gap-1 sm:gap-0">
        <h2 className="text-2xl font-bold text-gray-900">Ringkasan Penduduk</h2>
        {popSummary?.last_imported && (
          <span className="text-sm text-gray-500">
            Terakhir Ditarik: {formatDate(popSummary.last_imported)}
          </span>
        )}
      </div>

      {popLoading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : popError ? (
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center">
          <p className="text-red-600">{popError}</p>
        </div>
      ) : !popSummary ? (
        <div className="bg-white p-12 rounded-lg border border-gray-200 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-1">Belum Ada Data Penduduk</h3>
          <p className="text-gray-500">Data spreadsheet penduduk belum berhasil ditarik.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardBody className="p-5">
              <h3 className="text-sm font-medium text-gray-500">Total Penduduk</h3>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900">{popSummary.current_population}</p>
                {popSummary.net_change !== undefined && popSummary.net_change !== 0 && (
                  <span className={`text-sm font-medium ${popSummary.net_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {popSummary.net_change > 0 ? '+' : ''}{popSummary.net_change}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Snapshot: {popSummary.month}/{popSummary.year}
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-5">
              <h3 className="text-sm font-medium text-gray-500">Pertumbuhan Bersih</h3>
              <p className={`mt-2 text-3xl font-bold ${
                popSummary.net_growth > 0 ? 'text-emerald-600' : popSummary.net_growth < 0 ? 'text-rose-600' : 'text-gray-900'
              }`}>
                {popSummary.net_growth > 0 ? '+' : ''}{popSummary.net_growth}
              </p>
              <p className="text-xs text-gray-400 mt-1">Lahir + Masuk - Meninggal - Keluar</p>
            </CardBody>
          </Card>

          <Card className="sm:col-span-2 lg:col-span-2">
            <CardBody className="p-5">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Pergeseran Demografis</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Lahir</span>
                    <span className="font-medium text-green-600">+{popSummary.birth_total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Masuk</span>
                    <span className="font-medium text-green-600">+{popSummary.move_in_total}</span>
                  </div>
                </div>
                <div className="space-y-3 border-l pl-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Meninggal</span>
                    <span className="font-medium text-red-600">-{popSummary.death_total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Keluar</span>
                    <span className="font-medium text-red-600">-{popSummary.move_out_total}</span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </section>
  );
};

export const DashboardPage = () => {
  const { permissions } = useAuth();

  return (
    <div className="space-y-8">
      {/* System Overview Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Ringkasan Sistem</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {canManageNews(permissions) && <NewsWidget />}
          {canManageProducts(permissions) && <ProductsWidget />}
          {canManageAdministrators(permissions) && <AdminWidget />}
        </div>
      </section>

      {/* Population Overview Section */}
      {canManagePopulation(permissions) && <PopulationOverview />}
      
    </div>
  );
};

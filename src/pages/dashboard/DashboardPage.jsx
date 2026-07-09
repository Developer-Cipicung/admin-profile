import React from 'react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { useNews } from '../../hooks/useNews';
import { useProducts } from '../../hooks/useProducts';
import { useAdministrators } from '../../hooks/useAdministrators';
import { usePopulationSummary } from '../../hooks/usePopulationSummary';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/date';

export const DashboardPage = () => {
  const { pagination: newsPagination, loading: newsLoading } = useNews();
  const { pagination: productsPagination, loading: productsLoading } = useProducts();
  const { pagination: adminPagination, loading: adminLoading } = useAdministrators();
  const { summary: popSummary, loading: popLoading, error: popError } = usePopulationSummary();

  const totalNews = newsPagination?.totalItems || 0;
  const totalProducts = productsPagination?.totalItems || 0;
  const totalAdmins = adminPagination?.totalItems || 0;

  return (
    <div className="space-y-8">
      {/* System Overview Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">System Overview</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Total News</h3>
            </CardHeader>
            <CardBody>
              {newsLoading ? (
                <div className="h-9 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-3xl font-bold text-blue-600">{totalNews}</p>
              )}
            </CardBody>
          </Card>
          
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Total Products</h3>
            </CardHeader>
            <CardBody>
              {productsLoading ? (
                <div className="h-9 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-3xl font-bold text-green-600">{totalProducts}</p>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Administrators</h3>
            </CardHeader>
            <CardBody>
              {adminLoading ? (
                <div className="h-9 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-3xl font-bold text-purple-600">{totalAdmins}</p>
              )}
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Population Overview Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Population Overview</h2>
          {popSummary?.last_imported && (
            <span className="text-sm text-gray-500">
              Last Imported: {formatDate(popSummary.last_imported)}
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
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Population Data</h3>
            <p className="text-gray-500">A population spreadsheet has not been successfully crawled yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardBody className="p-5">
                <h3 className="text-sm font-medium text-gray-500">Current Population</h3>
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
                <h3 className="text-sm font-medium text-gray-500">Net Growth</h3>
                <p className={`mt-2 text-3xl font-bold ${
                  popSummary.net_growth > 0 ? 'text-emerald-600' : popSummary.net_growth < 0 ? 'text-rose-600' : 'text-gray-900'
                }`}>
                  {popSummary.net_growth > 0 ? '+' : ''}{popSummary.net_growth}
                </p>
                <p className="text-xs text-gray-400 mt-1">Births + MoveIn - Deaths - MoveOut</p>
              </CardBody>
            </Card>

            <Card className="sm:col-span-2 lg:col-span-2">
              <CardBody className="p-5">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Demographic Shifts</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Births</span>
                      <span className="font-medium text-green-600">+{popSummary.birth_total}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Move In</span>
                      <span className="font-medium text-green-600">+{popSummary.move_in_total}</span>
                    </div>
                  </div>
                  <div className="space-y-3 border-l pl-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Deaths</span>
                      <span className="font-medium text-red-600">-{popSummary.death_total}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Move Out</span>
                      <span className="font-medium text-red-600">-{popSummary.move_out_total}</span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </section>
      
    </div>
  );
};

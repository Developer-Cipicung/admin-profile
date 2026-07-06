import React from 'react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { useNews } from '../../hooks/useNews';
import { useProducts } from '../../hooks/useProducts';
import { useAdministrators } from '../../hooks/useAdministrators';

export const DashboardPage = () => {
  const { pagination: newsPagination, loading: newsLoading } = useNews();
  const { pagination: productsPagination, loading: productsLoading } = useProducts();
  const { pagination: adminPagination, loading: adminLoading } = useAdministrators();

  const totalNews = newsPagination?.totalItems || 0;
  const totalProducts = productsPagination?.totalItems || 0;
  const totalAdmins = adminPagination?.totalItems || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
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
      
      <Card>
        <CardBody>
          <p className="text-gray-500 text-center py-8">
            Welcome to the Administrator Dashboard. Features will be implemented in subsequent phases.
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

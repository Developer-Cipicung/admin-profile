import React from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { NotFoundPage } from '../pages/not-found/NotFoundPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import { NewsPage } from '../pages/news/NewsPage';
import { CreateNewsPage } from '../pages/news/CreateNewsPage';
import { EditNewsPage } from '../pages/news/EditNewsPage';
import { ProductPage } from '../pages/products/ProductPage';
import { CreateProductPage } from '../pages/products/CreateProductPage';
import { EditProductPage } from '../pages/products/EditProductPage';
import { AdministratorPage } from '../pages/administrators/AdministratorPage';
import { CreateAdministratorPage } from '../pages/administrators/CreateAdministratorPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/create" element={<CreateNewsPage />} />
          <Route path="/news/:id/edit" element={<EditNewsPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/products/create" element={<CreateProductPage />} />
          <Route path="/products/:id/edit" element={<EditProductPage />} />
          <Route path="/administrators" element={<AdministratorPage />} />
          <Route path="/administrators/create" element={<CreateAdministratorPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

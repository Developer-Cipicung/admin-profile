import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission } from '../../utils/permissions';

const RoleGuard = ({ children, permission, fallback = null }) => {
  const { admin, permissions } = useAuth();

  // If user is not logged in or role is missing, we shouldn't render children
  // Usually this is handled by PrivateRoute, but just in case:
  if (!admin || !admin.role) {
    return <Navigate to="/login" replace />;
  }

  // Check if the user's role has the required permission
  if (permission && !hasPermission(permissions, permission)) {
    return fallback || (
      <div className="flex flex-col items-center justify-center h-full min-h-[50vh] p-8 text-center">
        <div className="bg-red-50 text-red-600 rounded-full p-4 mb-4">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Akses Ditolak</h2>
        <p className="text-gray-500">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
      </div>
    );
  }

  return children ? children : <Outlet />;
};

export default RoleGuard;

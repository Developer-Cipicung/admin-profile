import React, { Component } from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { UnauthorizedError } from '../services/api';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    if (error instanceof UnauthorizedError) {
      return { hasError: true, isUnauthorized: true };
    }
    return { hasError: true, isUnauthorized: false };
  }

  componentDidCatch(error, errorInfo) {
    if (error instanceof UnauthorizedError) {
      this.props.logout();
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.state.isUnauthorized) {
        return <Navigate to="/login" replace />;
      }
      return <div className="p-4 text-red-600">Something went wrong rendering the page.</div>;
    }
    return this.props.children;
  }
}

export const ProtectedRoute = () => {
  const { isAuthenticated, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Wrap Outlet with ErrorBoundary so any UnauthorizedError thrown in children triggers logout.
  return (
    <ErrorBoundary logout={logout}>
      <Outlet />
    </ErrorBoundary>
  );
};

import React from 'react';
import { Link } from 'react-router';
import { Button } from '../../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-gray-200">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">Page Not Found</h2>
        <p className="mt-4 text-lg text-gray-500">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-8">
          <Link to="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

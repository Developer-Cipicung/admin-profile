import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useEditNews } from '../../hooks/useEditNews';
import { NewsForm } from '../../components/news/NewsForm';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
const BASE_URL = API_URL.replace('/api/v1', '');

export const EditNewsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { newsData, loading, submitting, error, serverError, updateNews } = useEditNews(id);

  const handleSubmit = async (data) => {
    const response = await updateNews(data);
    if (response.success) {
      navigate('/news', { state: { successMessage: 'News updated successfully.' } });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <LoadingSpinner className="w-10 h-10 text-primary-600 mb-4" />
        <p className="text-gray-500">Loading news data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg border border-red-200 flex flex-col items-center max-w-2xl text-center">
        <svg className="w-12 h-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-xl font-bold text-red-800 mb-2">Failed to Load Data</h2>
        <p className="text-red-600 mb-6">{error}</p>
        <button 
          onClick={() => navigate('/news')}
          className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-md transition-colors"
        >
          Return to News List
        </button>
      </div>
    );
  }

  if (!newsData) return null;

  // Resolve the full URL for the preview
  const previewUrl = newsData.thumbnail_url?.startsWith('http') 
    ? newsData.thumbnail_url 
    : `${BASE_URL}${newsData.thumbnail_url}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/news')}
          className="text-gray-500 hover:text-gray-700"
          disabled={submitting}
          aria-label="Go back"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Edit News</h2>
          <p className="mt-1 text-sm text-gray-500">Update an existing village announcement.</p>
        </div>
      </div>

      <div className={submitting ? 'opacity-50 pointer-events-none' : ''}>
        <NewsForm 
          defaultValues={{
            title: newsData.title,
            content: newsData.content,
            thumbnail: null // File object starts as null until a new file is picked
          }}
          previewUrl={previewUrl}
          loading={submitting}
          serverError={serverError}
          submitLabel="Save Changes"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

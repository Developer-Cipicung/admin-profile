import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCreateNews } from '../../hooks/useCreateNews';
import { NewsForm } from '../../components/news/NewsForm';

export const CreateNewsPage = () => {
  const navigate = useNavigate();
  const { submitNews, loading, error } = useCreateNews();

  const handleSubmit = async (data) => {
    const result = await submitNews(data);
    if (result) {
      navigate('/news', { state: { successMessage: 'Berita berhasil dibuat.' } });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/news')}
          className="text-gray-500 hover:text-gray-700"
          disabled={loading}
          aria-label="Go back"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Buat Berita</h2>
          <p className="mt-1 text-sm text-gray-500">Publikasikan artikel baru ke portal desa.</p>
        </div>
      </div>

      <div className={loading ? 'opacity-50 pointer-events-none' : ''}>
        <NewsForm 
          loading={loading}
          serverError={error}
          submitLabel="Publikasikan Berita"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

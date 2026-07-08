import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { newsService } from '../../services/news.service';
import { formatDate } from '../../utils/date';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
const BASE_URL = API_URL.replace('/api/v1', '');

export const ViewNewsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await newsService.getNewsById(id);
        if (response.success) {
          setNews(response.data);
        } else {
          setError('Failed to fetch news article.');
        }
      } catch (err) {
        if (err.status === 404) {
          setError('News article not found.');
        } else {
          setError('An error occurred while fetching the news.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <LoadingSpinner className="w-10 h-10 text-primary-600 mb-4" />
        <p className="text-gray-500">Loading article...</p>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="bg-red-50 p-6 rounded-lg border border-red-200 flex flex-col items-center max-w-2xl mx-auto text-center mt-10">
        <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
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

  const imageUrl = news.thumbnail_url?.startsWith('http') 
    ? news.thumbnail_url 
    : `${BASE_URL}${news.thumbnail_url}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header and Back Button */}
      <div className="flex items-center space-x-4 mb-6">
        <button 
          onClick={() => navigate('/news')}
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          title="Back to News"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">View Article</h2>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Cover Image */}
        {news.thumbnail_url && (
          <div className="w-full h-64 sm:h-80 md:h-96 relative bg-gray-100">
            <img 
              src={imageUrl} 
              alt={news.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = '/placeholder.png' }}
            />
          </div>
        )}

        <div className="p-6 sm:p-10 space-y-8">
          {/* Title and Meta */}
          <div className="space-y-4 border-b border-gray-100 pb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              {news.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 pt-2">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Created: {formatDate(news.created_at)}
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Updated: {formatDate(news.updated_at)}
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="prose prose-blue max-w-none prose-p:text-gray-700 prose-headings:text-gray-900 text-gray-800 whitespace-pre-wrap leading-relaxed">
            {news.content}
          </div>
        </div>
      </div>
    </div>
  );
};

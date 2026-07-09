import React from 'react';
import { formatDate } from '../../utils/date';

export const PopulationSourceTable = ({ sources, onView, onEdit, onDelete, onActivate, onCrawl, isCrawling }) => {
  return (
    <div className="hidden md:block overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
              Spreadsheet Name
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Worksheet
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Last Crawl
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Last Status
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Updated At
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {sources.map((source) => (
            <tr key={source.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                {source.name}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {source.worksheet_name}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                  source.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {source.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {source.last_crawled_at ? formatDate(source.last_crawled_at) : 'Never Crawled'}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {source.last_crawl_status?.toLowerCase() === 'running' ? (
                  <span className="text-yellow-600 font-medium">Running...</span>
                ) : source.last_crawl_status?.toLowerCase() === 'failed' ? (
                  <span className="text-red-600 font-medium">Failed</span>
                ) : source.last_crawl_status?.toLowerCase() === 'success' ? (
                  <span className="text-green-600 font-medium">Success</span>
                ) : (
                  '-'
                )}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {formatDate(source.updated_at)}
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => onCrawl(source)}
                    disabled={!source.is_active || isCrawling || source.last_crawl_status === 'Running'}
                    className={`font-medium ${
                      source.is_active && !isCrawling && source.last_crawl_status !== 'Running' 
                        ? 'text-purple-600 hover:text-purple-900' 
                        : 'text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {source.last_crawl_status === 'Running' ? 'Crawling...' : 'Crawl'}
                  </button>
                  {!source.is_active && (
                    <button
                      onClick={() => onActivate(source)}
                      disabled={isCrawling}
                      className="text-green-600 hover:text-green-900 font-medium disabled:opacity-50"
                    >
                      Activate
                    </button>
                  )}
                  <button
                    onClick={() => onView(source)}
                    className="text-gray-600 hover:text-gray-900 font-medium"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onEdit(source)}
                    disabled={isCrawling}
                    className="text-blue-600 hover:text-blue-900 font-medium disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(source)}
                    disabled={isCrawling}
                    className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

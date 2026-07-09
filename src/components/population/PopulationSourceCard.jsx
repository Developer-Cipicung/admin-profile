import React from 'react';
import { Card, CardBody } from '../common/Card';
import { formatDate } from '../../utils/date';

export const PopulationSourceCard = ({ source, onView, onEdit, onDelete, onActivate, onCrawl, isCrawling }) => {
  return (
    <Card className="mb-4">
      <CardBody className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-medium text-gray-900 truncate">{source.name}</h3>
            <p className="text-sm text-gray-500 truncate mt-1">Worksheet: {source.worksheet_name}</p>
          </div>
          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
            source.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {source.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
        
        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Status:</span>
            <span>{source.is_active ? <span className="text-green-600 font-medium">Active</span> : <span className="text-gray-500 font-medium">Inactive</span>}</span>
          </div>
          <div className="flex justify-between">
            <span>Last Crawled:</span>
            <span className="font-medium text-gray-900">
              {source.last_crawled_at ? formatDate(source.last_crawled_at) : 'Never Crawled'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Crawl Status:</span>
            <span>
              {source.last_crawl_status?.toLowerCase() === 'running' ? (
                <span className="text-yellow-600 font-medium">Running...</span>
              ) : source.last_crawl_status?.toLowerCase() === 'failed' ? (
                <span className="text-red-600 font-medium">Failed</span>
              ) : source.last_crawl_status?.toLowerCase() === 'success' ? (
                <span className="text-green-600 font-medium">Success</span>
              ) : (
                <span className="text-gray-500 font-medium">-</span>
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Updated At:</span>
            <span className="font-medium text-gray-900">{formatDate(source.updated_at)}</span>
          </div>
        </div>
        
        <div className="mt-6 flex flex-wrap justify-end gap-3 border-t pt-4">
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
      </CardBody>
    </Card>
  );
};

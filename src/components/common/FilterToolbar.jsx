import React from 'react';
import { Search } from './Search';
import { RefreshButton } from './RefreshButton';

export const FilterToolbar = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Cari...',
  sortValue,
  onSortChange,
  sortOptions = [],
  onRefresh,
  disabled = false
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <Search 
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={onSearchChange}
        disabled={disabled}
      />
      
      <div className="flex items-center gap-4 w-full sm:w-auto">
        {sortOptions.length > 0 && (
          <select
            value={sortValue}
            onChange={(e) => onSortChange(e.target.value)}
            className="block w-full sm:w-48 pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-gray-50"
            disabled={disabled}
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        )}
        {onRefresh && (
          <RefreshButton onRefresh={onRefresh} disabled={disabled} />
        )}
      </div>
    </div>
  );
};

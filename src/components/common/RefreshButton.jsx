import React from 'react';
import { Button } from './Button';

export const RefreshButton = ({ loading, onRefresh, className = '' }) => {
  return (
    <Button 
      variant="secondary" 
      onClick={onRefresh} 
      isLoading={loading}
      className={className}
      disabled={loading}
    >
      {loading ? 'Refreshing...' : 'Refresh'}
    </Button>
  );
};

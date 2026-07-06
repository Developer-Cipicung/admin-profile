import React from 'react';
import { Input } from '../form/Input';

export const Search = ({ value, onChange, disabled, placeholder = 'Search...' }) => {
  return (
    <div className="w-full sm:max-w-xs">
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
};

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../common/Button';
import { Input } from '../form/Input';

export const PopulationSourceForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: initialData?.name || '',
      spreadsheet_url: initialData?.spreadsheet_url || '',
      worksheet_name: initialData?.worksheet_name || 'CIPICUNG',
      is_active: initialData?.is_active || false,
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Spreadsheet Name"
        id="name"
        {...register('name', { required: 'Spreadsheet Name is required' })}
        error={errors.name?.message}
        placeholder="e.g. 2026 Population Data"
      />

      <Input
        label="Google Spreadsheet URL"
        id="spreadsheet_url"
        type="url"
        {...register('spreadsheet_url', { 
          required: 'Spreadsheet URL is required',
          pattern: {
            value: /^https:\/\/docs\.google\.com\/spreadsheets\/d\/.+/,
            message: 'Must be a valid Google Spreadsheet URL'
          }
        })}
        error={errors.spreadsheet_url?.message}
        placeholder="https://docs.google.com/spreadsheets/d/..."
      />

      <Input
        label="Worksheet Name"
        id="worksheet_name"
        {...register('worksheet_name', { required: 'Worksheet Name is required' })}
        error={errors.worksheet_name?.message}
        placeholder="e.g. CIPICUNG"
      />

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_active"
          {...register('is_active')}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
          Set as Active Source
        </label>
      </div>
      <p className="text-xs text-gray-500 ml-6">
        Activating this source will automatically deactivate the currently active source.
      </p>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Save Changes' : 'Create Source'}
        </Button>
      </div>
    </form>
  );
};

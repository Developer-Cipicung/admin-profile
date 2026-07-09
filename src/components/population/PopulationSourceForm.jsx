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
        label="Nama Spreadsheet"
        id="name"
        {...register('name', { required: 'Nama Spreadsheet wajib diisi' })}
        error={errors.name?.message}
        placeholder="misal. Data Penduduk 2026"
      />

      <Input
        label="Google Spreadsheet URL"
        id="spreadsheet_url"
        type="url"
        {...register('spreadsheet_url', { 
          required: 'URL Spreadsheet wajib diisi',
          pattern: {
            value: /^https:\/\/docs\.google\.com\/spreadsheets\/d\/.+/,
            message: 'Harus berupa URL Google Spreadsheet yang valid'
          }
        })}
        error={errors.spreadsheet_url?.message}
        placeholder="https://docs.google.com/spreadsheets/d/..."
      />

      <Input
        label="Nama Worksheet"
        id="worksheet_name"
        {...register('worksheet_name', { required: 'Nama Worksheet wajib diisi' })}
        error={errors.worksheet_name?.message}
        placeholder="misal. CIPICUNG"
      />

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_active"
          {...register('is_active')}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
          Jadikan Sumber Aktif
        </label>
      </div>
      <p className="text-xs text-gray-500 ml-6">
        Mengaktifkan sumber ini akan otomatis menonaktifkan sumber data yang sedang aktif.
      </p>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Simpan Perubahan' : 'Tambah Sumber'}
        </Button>
      </div>
    </form>
  );
};

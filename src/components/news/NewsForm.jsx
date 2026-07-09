import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '../form/Input';
import { Textarea } from '../form/Textarea';
import { Button } from '../common/Button';
import { ImageUpload } from '../common/ImageUpload';

export const NewsForm = ({ 
  defaultValues = { title: '', content: '', thumbnail: null }, 
  loading = false, 
  serverError = null, 
  submitLabel = 'Submit', 
  onSubmit,
  previewUrl = null,
}) => {
  const { 
    register, 
    handleSubmit, 
    control,
    setValue,
    formState: { errors } 
  } = useForm({ defaultValues });

  const handleFormSubmit = (data) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 max-w-2xl bg-white p-6 rounded-lg border border-gray-200">
      
      {serverError && (
        <div className="p-4 rounded-md bg-red-50 border border-red-200">
          <h3 className="text-sm font-medium text-red-800">Kesalahan Pengiriman</h3>
          <p className="mt-1 text-sm text-red-600">{serverError}</p>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Judul <span className="text-red-500">*</span>
        </label>
        <Input
          id="title"
          disabled={loading}
          {...register('title', { 
            required: 'Judul wajib diisi',
            maxLength: { value: 255, message: 'Judul tidak boleh lebih dari 255 karakter' }
          })}
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Konten <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="content"
          rows={8}
          disabled={loading}
          {...register('content', { 
            required: 'Konten wajib diisi'
          })}
        />
        {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
      </div>

      <Controller
        control={control}
        name="thumbnail"
        render={({ field: { value, onChange } }) => (
        <ImageUpload
            label="Gambar Utama (Opsional)"
            value={value}
            previewUrl={value === null ? null : previewUrl}
            onChange={(file) => setValue('thumbnail', file, { shouldValidate: true })}
            onRemove={() => setValue('thumbnail', null, { shouldValidate: true })}
            disabled={loading}
          />
        )}
      />

      <div className="pt-4 border-t border-gray-200 flex justify-end">
        <Button 
          type="submit" 
          variant="primary" 
          isLoading={loading}
          disabled={loading}
        >
          {loading ? 'Menyimpan...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};

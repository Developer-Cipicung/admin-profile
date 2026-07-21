import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '../form/Input';
import { Textarea } from '../form/Textarea';
import { Button } from '../common/Button';
import { ImageUpload } from '../common/ImageUpload';

export const ProductForm = ({
  defaultValues = { name: '', description: '', price: '', no_telp: '', image: null },
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
    formState: { errors },
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
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nama Produk <span className="text-red-500">*</span>
        </label>
        <Input
          id="name"
          disabled={loading}
          {...register('name', { 
            required: 'Nama produk wajib diisi',
            maxLength: { value: 255, message: 'Nama tidak boleh lebih dari 255 karakter' }
          })}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="description"
          rows={4}
          disabled={loading}
          {...register('description', { 
            required: 'Deskripsi wajib diisi',
            maxLength: { value: 255, message: 'Deskripsi tidak boleh lebih dari 255 karakter' }
          })}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
          Harga (Rp) <span className="text-red-500">*</span>
        </label>
        <Input
          id="price"
          type="number"
          min="1"
          step="1"
          disabled={loading}
          placeholder="e.g. 35000"
          {...register('price', { 
            required: 'Harga wajib diisi',
            valueAsNumber: true,
            min: { value: 1, message: 'Harga harus lebih besar dari 0' },
            validate: (value) => Number.isInteger(value) || 'Harga harus berupa bilangan bulat'
          })}
        />
        {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
      </div>

      <div>
        <label htmlFor="no_telp" className="block text-sm font-medium text-gray-700 mb-1">
          Nomor Telepon (WhatsApp) <span className="text-gray-400 font-normal">(Opsional)</span>
        </label>
        <Input
          id="no_telp"
          type="tel"
          disabled={loading}
          placeholder="e.g. 081234567890"
          {...register('no_telp', { 
            maxLength: { value: 20, message: 'Nomor telepon tidak boleh lebih dari 20 karakter' }
          })}
        />
        {errors.no_telp && <p className="mt-1 text-sm text-red-600">{errors.no_telp.message}</p>}
      </div>

      <Controller
        control={control}
        name="image"
        render={({ field: { value, onChange } }) => (
          <div className="sm:col-span-2 pt-2">
            <ImageUpload
              label="Gambar Produk (Opsional)"
              value={value}
              previewUrl={value === null ? null : previewUrl}
              onChange={(file) => setValue('image', file, { shouldValidate: true })}
              onRemove={() => setValue('image', null, { shouldValidate: true })}
              disabled={loading}
            />
          </div>
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

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '../form/Input';
import { Textarea } from '../form/Textarea';
import { Button } from '../common/Button';
import { ImageUpload } from '../common/ImageUpload';

export const ProductForm = ({
  defaultValues = { name: '', description: '', price: '', image: null },
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
          <h3 className="text-sm font-medium text-red-800">Submission Error</h3>
          <p className="mt-1 text-sm text-red-600">{serverError}</p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Product Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="name"
          disabled={loading}
          {...register('name', { 
            required: 'Product name is required',
            maxLength: { value: 255, message: 'Name cannot exceed 255 characters' }
          })}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="description"
          rows={4}
          disabled={loading}
          {...register('description', { 
            required: 'Description is required',
            maxLength: { value: 255, message: 'Description cannot exceed 255 characters' }
          })}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
          Price (Rp) <span className="text-red-500">*</span>
        </label>
        <Input
          id="price"
          type="number"
          min="1"
          step="1"
          disabled={loading}
          placeholder="e.g. 35000"
          {...register('price', { 
            required: 'Price is required',
            valueAsNumber: true,
            min: { value: 1, message: 'Price must be greater than 0' },
            validate: (value) => Number.isInteger(value) || 'Price must be a whole number (no decimals)'
          })}
        />
        {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
      </div>

      <Controller
        control={control}
        name="image"
        render={({ field: { value, onChange } }) => (
          <div className="sm:col-span-2 pt-2">
            <ImageUpload
              label="Product Image (Optional)"
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
          {loading ? 'Submitting...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};

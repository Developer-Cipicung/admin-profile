import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../form/Input';
import { PasswordInput } from '../form/PasswordInput';
import { Button } from '../common/Button';

export const AdministratorForm = ({
  defaultValues = { username: '', full_name: '', password: '', confirm_password: '' },
  loading = false,
  serverError = null,
  submitLabel = 'Submit',
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues });

  const passwordValue = watch('password');

  const handleFormSubmit = (data) => {
    if (onSubmit) {
      onSubmit({
        username: data.username,
        full_name: data.full_name,
        password: data.password
      });
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
        <Input
          label={<>Username <span className="text-red-500">*</span></>}
          id="username"
          disabled={loading}
          error={errors.username?.message}
          {...register('username', { 
            required: 'Username is required',
            minLength: { value: 3, message: 'Username must be at least 3 characters' },
            maxLength: { value: 50, message: 'Username cannot exceed 50 characters' },
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message: 'Username can only contain alphanumeric characters and underscores'
            }
          })}
        />
      </div>

      <div>
        <Input
          label={<>Full Name <span className="text-red-500">*</span></>}
          id="full_name"
          disabled={loading}
          error={errors.full_name?.message}
          {...register('full_name', { 
            required: 'Full name is required',
            minLength: { value: 3, message: 'Full name must be at least 3 characters' },
            maxLength: { value: 100, message: 'Full name cannot exceed 100 characters' }
          })}
        />
      </div>

      <div>
        <PasswordInput
          label={<>Password <span className="text-red-500">*</span></>}
          id="password"
          disabled={loading}
          error={errors.password?.message}
          {...register('password', { 
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' },
            maxLength: { value: 255, message: 'Password cannot exceed 255 characters' }
          })}
        />
      </div>
      
      <div>
        <PasswordInput
          label={<>Confirm Password <span className="text-red-500">*</span></>}
          id="confirm_password"
          disabled={loading}
          error={errors.confirm_password?.message}
          {...register('confirm_password', { 
            required: 'Confirm Password is required',
            validate: (value) => value === passwordValue || 'Passwords do not match'
          })}
        />
      </div>

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

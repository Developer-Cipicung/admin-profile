import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../form/Input';
import { PasswordInput } from '../form/PasswordInput';
import { Button } from '../common/Button';

export const AdministratorForm = ({
  defaultValues = { username: '', full_name: '', role: 'PROFILE_ADMIN', password: '', confirm_password: '' },
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
        role: data.role,
        password: data.password
      });
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
        <Input
          label={<>Nama Pengguna <span className="text-red-500">*</span></>}
          id="username"
          disabled={loading}
          error={errors.username?.message}
          {...register('username', { 
            required: 'Nama pengguna wajib diisi',
            minLength: { value: 3, message: 'Nama pengguna minimal 3 karakter' },
            maxLength: { value: 50, message: 'Nama pengguna maksimal 50 karakter' },
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message: 'Nama pengguna hanya boleh berisi huruf, angka, dan garis bawah'
            }
          })}
        />
      </div>

      <div>
        <Input
          label={<>Nama Lengkap <span className="text-red-500">*</span></>}
          id="full_name"
          disabled={loading}
          error={errors.full_name?.message}
          {...register('full_name', { 
            required: 'Nama lengkap wajib diisi',
            minLength: { value: 3, message: 'Nama lengkap minimal 3 karakter' },
            maxLength: { value: 100, message: 'Nama lengkap maksimal 100 karakter' }
          })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Peran <span className="text-red-500">*</span>
        </label>
        <select
          id="role"
          disabled={loading}
          className={`w-full rounded-md border ${
            errors.role ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          } shadow-sm px-4 py-2 bg-white text-gray-900 outline-none transition-colors disabled:bg-gray-100 disabled:text-gray-500`}
          {...register('role', { required: 'Peran wajib diisi' })}
        >
          <option value="PROFILE_ADMIN">Admin Profil (Berita & Penduduk)</option>
          <option value="MARKETING_ADMIN">Admin Marketing (Produk)</option>
        </select>
        {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
      </div>

      <div>
        <PasswordInput
          label={<>Kata Sandi <span className="text-red-500">*</span></>}
          id="password"
          disabled={loading}
          error={errors.password?.message}
          {...register('password', { 
            required: 'Kata sandi wajib diisi',
            minLength: { value: 6, message: 'Kata sandi minimal 6 karakter' },
            maxLength: { value: 255, message: 'Kata sandi maksimal 255 karakter' }
          })}
        />
      </div>
      
      <div>
        <PasswordInput
          label={<>Konfirmasi Kata Sandi <span className="text-red-500">*</span></>}
          id="confirm_password"
          disabled={loading}
          error={errors.confirm_password?.message}
          {...register('confirm_password', { 
            required: 'Konfirmasi kata sandi wajib diisi',
            validate: (value) => value === passwordValue || 'Kata sandi tidak cocok'
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
          {loading ? 'Menyimpan...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/form/Input';

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoginLoading(true);
    setErrorMessage('');
    
    try {
      const response = await login(data.username, data.password);
      if (response.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      setErrorMessage(error.message || 'Terjadi kesalahan tidak terduga.');
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Masuk ke Akun Anda</h2>
      </div>
      
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Username"
          id="username"
          type="text"
          {...register('username', { required: 'Username wajib diisi' })}
          error={errors.username?.message}
          disabled={loginLoading}
        />

        <div className="relative">
          <Input
            label="Kata Sandi"
            id="password"
            type={showPassword ? "text" : "password"}
            {...register('password', { required: 'Kata sandi wajib diisi' })}
            error={errors.password?.message}
            disabled={loginLoading}
          />
          <button
            type="button"
            className="absolute right-3 top-7 text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loginLoading}
          >
            {showPassword ? 'Sembunyikan' : 'Tampilkan'}
          </button>
        </div>

        <Button 
          type="submit" 
          className="w-full"
          isLoading={loginLoading}
        >
          Masuk
        </Button>
      </form>
    </div>
  );
};

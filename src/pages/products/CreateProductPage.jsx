import React from 'react';
import { useNavigate } from 'react-router';
import { useCreateProduct } from '../../hooks/useCreateProduct';
import { ProductForm } from '../../components/products/ProductForm';

export const CreateProductPage = () => {
  const navigate = useNavigate();
  const { createProduct, loading, serverError } = useCreateProduct();

  const handleSubmit = async (data) => {
    const response = await createProduct(data);
    if (response.success) {
      navigate('/products', { state: { successMessage: 'Produk berhasil dibuat.' } });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/products')}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          title="Kembali ke Produk"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Buat Produk</h2>
          <p className="mt-1 text-sm text-gray-500">Tambah produk UMKM baru ke katalog.</p>
        </div>
      </div>

      <ProductForm 
        onSubmit={handleSubmit}
        loading={loading}
        serverError={serverError}
        submitLabel="Buat Produk"
      />
    </div>
  );
};

import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useEditProduct } from '../../hooks/useEditProduct';
import { ProductForm } from '../../components/products/ProductForm';

const API_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';

const getFullImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_URL}${path}`;
};

export const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, fetchProduct, updateProduct, loading, fetching, serverError } = useEditProduct(id);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleSubmit = async (data) => {
    const response = await updateProduct(data);
    if (response) {
      navigate('/products', { state: { successMessage: 'Produk berhasil diperbarui.' } });
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (!product && !fetching) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Produk tidak ditemukan</h3>
        <p className="mt-2 text-sm text-gray-500">Produk yang ingin diedit tidak ada atau telah dihapus.</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 text-sm text-blue-600 hover:text-blue-800"
        >
          Kembali ke Produk
        </button>
      </div>
    );
  }

  const defaultValues = {
    name: product.name || '',
    description: product.description || '',
    price: product.price || '',
    image: product.image_url, // Pass the string URL so preview works initially
  };

  const currentImageUrl = getFullImageUrl(product.image_url);

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
          <h2 className="text-2xl font-bold text-gray-900">Edit Produk</h2>
          <p className="mt-1 text-sm text-gray-500">Perbarui detail dan gambar produk.</p>
        </div>
      </div>

      <ProductForm 
        defaultValues={defaultValues}
        previewUrl={currentImageUrl}
        onSubmit={handleSubmit}
        loading={loading}
        serverError={serverError}
        submitLabel="Simpan Perubahan"
      />
    </div>
  );
};

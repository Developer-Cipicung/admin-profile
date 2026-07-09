import React from 'react';
import { useNavigate } from 'react-router';
import { useCreateAdministrator } from '../../hooks/useCreateAdministrator';
import { AdministratorForm } from '../../components/administrators/AdministratorForm';

export const CreateAdministratorPage = () => {
  const navigate = useNavigate();
  const { createAdministrator, loading, error } = useCreateAdministrator();

  const handleSubmit = async (data) => {
    const result = await createAdministrator(data);
    if (result.success) {
      navigate('/administrators', { 
        state: { successMessage: `Admin "${data.username}" berhasil dibuat.` }
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Buat Admin</h2>
        <p className="mt-1 text-sm text-gray-500">
          Tambah admin baru ke dashboard.
        </p>
      </div>

      <AdministratorForm 
        onSubmit={handleSubmit} 
        loading={loading} 
        serverError={error}
        submitLabel="Buat Admin"
      />
    </div>
  );
};

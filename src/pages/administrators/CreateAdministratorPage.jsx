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
        state: { successMessage: `Administrator "${data.username}" has been created successfully.` }
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Create Administrator</h2>
        <p className="mt-1 text-sm text-gray-500">
          Add a new administrator to the dashboard.
        </p>
      </div>

      <AdministratorForm 
        onSubmit={handleSubmit} 
        loading={loading} 
        serverError={error}
        submitLabel="Create Administrator"
      />
    </div>
  );
};

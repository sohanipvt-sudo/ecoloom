import React from 'react';
import { useNavigate } from 'react-router-dom';
import SpeciesCatalogModal from '../components/SpeciesCatalogModal';

export default function SpeciesCatalogPage() {
  const navigate = useNavigate();
  return (
    <div className="p-6">
      <button onClick={() => navigate(-1)} className="mb-4 text-sm text-forest-deep">← Back</button>
      <SpeciesCatalogModal inline onClose={() => navigate(-1)} />
    </div>
  );
}

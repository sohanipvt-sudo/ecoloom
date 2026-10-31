import React from 'react';
import { useNavigate } from 'react-router-dom';
import CropAdvisorModal from '../components/CropAdvisorModal';

export default function CropAdvisorPage() {
  const navigate = useNavigate();
  return (
    <div className="p-6">
      <button onClick={() => navigate(-1)} className="mb-4 text-sm text-forest-deep">← Back</button>
      <CropAdvisorModal inline onClose={() => navigate(-1)} />
    </div>
  );
}

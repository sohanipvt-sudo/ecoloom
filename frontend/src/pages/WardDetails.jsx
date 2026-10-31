import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PlotInspectorModal from '../components/PlotInspectorModal'

export default function WardDetails() {
  const location = useLocation()
  const navigate = useNavigate()
  const parcel = location.state?.parcel || null

  if (!parcel) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold">Ward Details</h2>
        <p className="mt-4">No area selected. Return to the map to choose a ward area.</p>
        <button onClick={() => navigate('/')} className="mt-4 px-3 py-2 bg-forest-deep text-white rounded">Back to Map</button>
      </div>
    )
  }

  // Reuse the PlotInspectorModal UI but render as a full page
  return (
    <div className="min-h-screen bg-[#fbfcf8]">
      <div className="max-w-5xl mx-auto p-6">
        <PlotInspectorModal parcel={parcel} onClose={() => navigate(-1)} onOpenCropAdvisor={() => navigate('/crop-advisor', { state: { env: parcel.properties?.env_params } })} />
      </div>
    </div>
  )
}

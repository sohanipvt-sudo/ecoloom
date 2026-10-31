import React, { useState } from 'react';
import {
  Trees,
  Leaf,
  Wind,
  Mountain,
  Droplets,
  Sun,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronRight,
  Sparkles,
  Layers,
  Search,
  ShieldCheck,
  Sliders,
  RefreshCw,
  Cpu,
  BookOpen,
  Zap,
  Flame,
  Sprout,
  TrendingUp,
  Thermometer,
  Compass,
  MapPin
} from 'lucide-react';

export default function Sidebar({
  scanData,
  selectedPreset,
  onSelectParcel,
  selectedParcel,
  isScanning,
  onTriggerScan,
  onOpenSpeciesModal,
  onOpenCatalog,
  onOpenMLDiagnostics,
  onOpenCropAdvisor,
  envParams,
  onUpdateEnvParam,
  onResetEnvParams
}) {
  const [showEnvDossier, setShowEnvDossier] = useState(false);
  const currentEnv = scanData?.inferred_env || selectedPreset?.baseline_env || selectedPreset?.default_env || envParams;

  const roi = scanData?.roi_analysis || {};
  const breakdown = roi?.breakdown || {};
  const summary = scanData?.summary || {};
  const parcels = scanData?.land_allocation?.plantable_zones?.features ||
    scanData?.plantable_zones?.features ||
    scanData?.land_allocation?.candidate_parcels_geojson?.features ||
    scanData?.candidate_parcels_geojson?.features || [];

  const excludedZones = scanData?.land_allocation?.non_plantable_zones?.features ||
    scanData?.non_plantable_zones?.features ||
    scanData?.land_allocation?.exclusion_mask_geojson?.features || [];

  const afforestationScore = roi?.afforestation_score ?? 26.5;
  const meanNdvi = roi?.mean_ndvi ?? 0.284;

  // Calculate SVG circular gauge metrics
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (afforestationScore / 100) * circumference;

  // AQI color & badge helper
  const getAqiBadge = (aqi) => {
    if (aqi <= 50) return { label: 'Good (Pristine)', color: '#52b788', bg: '#dcfce7' };
    if (aqi <= 100) return { label: 'Moderate', color: '#80b918', bg: '#f4fce3' };
    if (aqi <= 180) return { label: 'Unhealthy (Dust/PM)', color: '#f77f00', bg: '#fef3c7' };
    if (aqi <= 280) return { label: 'Severe / Critical', color: '#d90429', bg: '#fee2e2' };
    return { label: 'Hazardous (Toxic)', color: '#7209b7', bg: '#f3e8ff' };
  };

  const aqiBadge = getAqiBadge(envParams.ambient_aqi);

  return (
    <aside className="w-full md:w-[420px] lg:w-[450px] h-full bg-[#f8f9fa] border-r border-forest-200/80 flex flex-col z-20 overflow-y-auto shadow-md">

      {/* 1. Header & Location Summary */}
      <div className="p-4 bg-white border-b border-forest-100 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-forest-500 animate-ping" />
            <h2 className="font-bold text-sm text-forest-deep uppercase tracking-wider">
              Afforestation Telemetry
            </h2>
          </div>
          <span className="text-[11px] font-medium text-slate-500 bg-forest-50 px-2 py-0.5 rounded-md border border-forest-200">
            {roi.total_area_ha ? `${roi.total_area_ha} ha Scanned` : 'Active ROI'}
          </span>
        </div>

        {/* Selected Biome / Custom Location Card */}
        <div className="bg-forest-50/70 rounded-xl p-2.5 border border-forest-200/80 mb-2.5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-xs text-forest-deep flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-forest-medium shrink-0" />
                <span>{selectedPreset?.name || 'Custom Global Area Selection'}</span>
              </h3>
              <p className="text-[11px] text-forest-700 ml-5 font-semibold">
                {selectedPreset?.region || 'Live Geocoded Coordinates'}
              </p>
            </div>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
              {selectedPreset ? 'Preset Biome' : 'Custom ROI'}
            </span>
          </div>
          {selectedPreset?.description && (
            <p className="text-[11px] text-slate-600 mt-1.5 ml-5 line-clamp-2 leading-relaxed">
              {selectedPreset.description}
            </p>
          )}

          {/* Collapsible Terrain & Environmental Features */}
          <div className="mt-2.5 pt-2 border-t border-forest-200/50 flex flex-col">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowEnvDossier(!showEnvDossier)}
                className="text-[11px] font-extrabold text-forest-medium hover:text-forest-deep flex items-center space-x-1"
              >
                <span>{showEnvDossier ? 'Hide Area Dossier' : 'Inspect Terrain & Environment'}</span>
                <ChevronRight className={`w-3.5 h-3.5 transform transition-transform ${showEnvDossier ? 'rotate-90' : ''}`} />
              </button>
              {!showEnvDossier && currentEnv && (
                <span className="text-[10px] text-slate-500 font-medium">
                  {currentEnv.climate_zone} • Slope {currentEnv.slope_deg || 8}°
                </span>
              )}
            </div>

            {showEnvDossier && currentEnv && (
              <div className="mt-2.5 pt-2 border-t border-forest-200/30 grid grid-cols-2 gap-2 text-[11px] text-slate-700 animate-fadeIn">
                {/* 1. Terrain & Slope */}
                <div className="bg-white/80 p-2 rounded-lg border border-forest-100/60 space-y-1 shadow-sm">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Mountain className="w-3 h-3 text-forest-medium" /> Terrain
                  </span>
                  <span className="text-forest-deep font-extrabold block">
                    {currentEnv.slope_deg}° Incline
                  </span>
                  <span className="text-slate-500 text-[10px] block font-medium leading-tight">
                    {currentEnv.slope_class || 'Moderate slope'}
                  </span>
                </div>

                {/* 2. Land Type & Soil Texture */}
                <div className="bg-white/80 p-2 rounded-lg border border-forest-100/60 space-y-1 shadow-sm">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sprout className="w-3 h-3 text-emerald-600" /> Soil Texture
                  </span>
                  <span className="text-forest-deep font-extrabold block truncate" title={currentEnv.soil_texture || currentEnv.land_type}>
                    {currentEnv.soil_texture || 'Loamy Mix'}
                  </span>
                  <span className="text-slate-500 text-[10px] block font-medium leading-tight truncate" title={currentEnv.land_type}>
                    Type: {currentEnv.land_type}
                  </span>
                </div>

                {/* 3. Soil pH & SOC */}
                <div className="bg-white/80 p-2 rounded-lg border border-forest-100/60 space-y-1 shadow-sm">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-amber-600" /> Chemistry
                  </span>
                  <span className="text-forest-deep font-extrabold block">
                    pH {currentEnv.soil_ph}
                  </span>
                  <span className="text-slate-500 text-[10px] block font-medium leading-tight">
                    SOC: {currentEnv.soil_organic_carbon || 0.65}% Carbon
                  </span>
                </div>

                {/* 4. Climate Zone */}
                <div className="bg-white/80 p-2 rounded-lg border border-forest-100/60 space-y-1 shadow-sm">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sun className="w-3 h-3 text-amber-500" /> Climate
                  </span>
                  <span className="text-forest-deep font-extrabold block truncate" title={currentEnv.climate_zone}>
                    {currentEnv.climate_zone}
                  </span>
                  <span className="text-slate-500 text-[10px] block font-medium leading-tight truncate" title={currentEnv.koppen_code}>
                    {currentEnv.koppen_code || 'Koppen N/A'}
                  </span>
                </div>

                {/* 5. Annual Rainfall & Hydrology */}
                <div className="bg-white/80 p-2 rounded-lg border border-forest-100/60 space-y-1 shadow-sm">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-blue-500" /> Hydrology
                  </span>
                  <span className="text-forest-deep font-extrabold block">
                    {currentEnv.annual_rainfall_mm} mm/yr
                  </span>
                  <span className="text-slate-500 text-[10px] block font-medium leading-tight truncate" title={currentEnv.water_type}>
                    {currentEnv.water_type}
                  </span>
                </div>

                {/* 6. Temperature & Humidity */}
                <div className="bg-white/80 p-2 rounded-lg border border-forest-100/60 space-y-1 shadow-sm">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-rose-500" /> Temp/Humid
                  </span>
                  <span className="text-forest-deep font-extrabold block">
                    {currentEnv.temperature_c || 26}°C
                  </span>
                  <span className="text-slate-500 text-[10px] block font-medium leading-tight">
                    Humidity: {currentEnv.humidity_pct || 60}%
                  </span>
                </div>

                {/* 7. Air Quality & Stress */}
                <div className="col-span-2 bg-white/80 p-2.5 rounded-lg border border-forest-100/60 space-y-1 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Wind className="w-3 h-3 text-teal-500" /> Ambient AQI
                    </span>
                    <span className="text-forest-deep font-extrabold text-xs">
                      AQI {currentEnv.ambient_aqi}
                    </span>
                  </div>
                  {currentEnv.aqi_breakdown && (
                    <div className="grid grid-cols-4 gap-1 text-[9px] text-slate-500 pt-1 border-t border-slate-100 font-mono">
                      <div>PM2.5: <strong className="text-slate-700">{currentEnv.aqi_breakdown.pm25}</strong></div>
                      <div>PM10: <strong className="text-slate-700">{currentEnv.aqi_breakdown.pm10}</strong></div>
                      <div>CO: <strong className="text-slate-700">{currentEnv.aqi_breakdown.co}</strong></div>
                      <div>SO₂: <strong className="text-slate-700">{currentEnv.aqi_breakdown.so2}</strong></div>
                    </div>
                  )}
                </div>

                {/* 8. Proximity & Quality details */}
                {currentEnv.water_quality && (
                  <div className="col-span-2 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/60 text-[10px] text-emerald-900 space-y-0.5 shadow-sm leading-normal">
                    <div>💧 <strong>Water Quality:</strong> {currentEnv.water_quality.status}</div>
                    <div className="grid grid-cols-2 gap-1 text-[9px] text-emerald-800">
                      <div>pH: <strong>{currentEnv.water_quality.ph}</strong></div>
                      <div>Salinity: <strong>{currentEnv.water_quality.salinity_ppt} ppt</strong></div>
                    </div>
                    <div>📍 <strong>Nearest Water Proximity:</strong> ~{currentEnv.nearest_water_m} meters</div>
                  </div>
                )}

                {/* 9. Description / Summary */}
                {currentEnv.climate_summary && (
                  <div className="col-span-2 text-[10px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100/80 leading-relaxed font-sans">
                    "{currentEnv.climate_summary}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Re-Analyze Button */}
        <button
          onClick={onTriggerScan}
          disabled={isScanning}
          className="w-full py-2 px-3 bg-forest-deep hover:bg-forest-medium text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-all disabled:opacity-50"
        >
          {isScanning ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Scanning Sentinel-2 Spectral Bands...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-forest-mint" />
              <span>Re-Analyze Satellite ROI & Land Allocation</span>
            </>
          )}
        </button>
      </div>

      <div className="p-4 space-y-4">

        {/* Crop & Agroforestry Advisor Direct CTA Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-forest-900 to-forest-deep text-white rounded-2xl p-3.5 border border-emerald-500/40 shadow-organic space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
              <Sprout className="w-3 h-3 text-emerald-400" />
              <span>Agronomy & N-P-K Simulator</span>
            </span>
            <span className="text-[10px] font-extrabold text-forest-pale">45+ Crops</span>
          </div>

          <p className="text-xs text-forest-pale/90 leading-snug">
            Simulate Nitrogen, Phosphorus, Potassium, and thermal regimes for precision crop matching, harvest yields, and alley agroforestry.
          </p>

          <button
            onClick={onOpenCropAdvisor}
            className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-sm transition-all flex items-center justify-center space-x-1.5"
          >
            <span>🌾 Launch Crop & N-P-K Advisor</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2. 🎛️ 4-Pillar Environmental Simulator & Matchmaking Control Card */}
        <div className="bg-white rounded-2xl p-4 border border-forest-200/70 shadow-organic space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <Sliders className="w-4 h-4 text-forest-deep" />
              <h4 className="text-xs font-extrabold text-forest-deep uppercase tracking-wider">
                4-Pillar Environmental Matrix
              </h4>
            </div>
            <button
              onClick={onResetEnvParams}
              className="text-[10px] text-slate-400 hover:text-forest-deep flex items-center space-x-1 font-medium transition-colors"
              title="Reset parameters to location default"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Plants and crops are matched dynamically across Climate, Water Type, Land Type, and AQI. Adjust any pillar below:
          </p>

          <div className="space-y-3">
            {/* Pillar 1: Climate */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 flex items-center space-x-1 mb-1">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>1. Climate Zone</span>
              </label>
              <select
                value={envParams.climate_zone}
                onChange={(e) => onUpdateEnvParam('climate_zone', e.target.value)}
                className="w-full bg-forest-50/70 hover:bg-forest-50 focus:bg-white text-xs font-semibold text-forest-deep p-2 rounded-xl border border-forest-200 focus:outline-none focus:ring-2 focus:ring-forest-leaf/50"
              >
                <option value="Arid / Desert">Arid / Desert (High Heat, Rainfall &lt; 250mm)</option>
                <option value="Semi-Arid Subtropical">Semi-Arid Subtropical (Rainfall 300-750mm)</option>
                <option value="Tropical Wet">Tropical Wet (Humid, Rainfall &gt; 1500mm)</option>
                <option value="Montane / Temperate">Montane / Temperate (Cool, Higher Elevation)</option>
                <option value="Mediterranean / Dry Summer">Mediterranean / Dry Summer (Mild, Dry Hot)</option>
                <option value="Coastal / Maritime">Coastal / Maritime (Humid, Salt Spray)</option>
              </select>
            </div>

            {/* Pillar 2: Water Type */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 flex items-center space-x-1 mb-1">
                <Droplets className="w-3.5 h-3.5 text-blue-500" />
                <span>2. Water Regime & Quality</span>
              </label>
              <select
                value={envParams.water_type}
                onChange={(e) => onUpdateEnvParam('water_type', e.target.value)}
                className="w-full bg-forest-50/70 hover:bg-forest-50 focus:bg-white text-xs font-semibold text-forest-deep p-2 rounded-xl border border-forest-200 focus:outline-none focus:ring-2 focus:ring-forest-leaf/50"
              >
                <option value="Groundwater Deficit / Low Soil Moisture">Groundwater Deficit / Low Soil Moisture</option>
                <option value="Freshwater River / Canal">Freshwater River / Perennial Canal</option>
                <option value="Brackish / Saline Marsh">Brackish / Saline Tidal Marsh</option>
                <option value="Treated Wastewater / Urban Runoff">Treated Wastewater / Urban Runoff</option>
                <option value="Alkaline / Hard Water">Alkaline / Hard Carbonate Water</option>
              </select>
            </div>

            {/* Pillar 3: Land Type */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 flex items-center space-x-1 mb-1">
                <Mountain className="w-3.5 h-3.5 text-forest-medium" />
                <span>3. Land & Soil Topology</span>
              </label>
              <select
                value={envParams.land_type}
                onChange={(e) => onUpdateEnvParam('land_type', e.target.value)}
                className="w-full bg-forest-50/70 hover:bg-forest-50 focus:bg-white text-xs font-semibold text-forest-deep p-2 rounded-xl border border-forest-200 focus:outline-none focus:ring-2 focus:ring-forest-leaf/50"
              >
                <option value="Rocky Wasteland / Steep Ridge">Rocky Wasteland / Steep Ridge (&gt;15° Slope)</option>
                <option value="Mining Spoil / Degraded Land">Mining Spoil / Stripped Overburden</option>
                <option value="Sandy Dunes / Desert Soil">Sandy Dunes / Desert Soil (High Permeability)</option>
                <option value="Degraded Agricultural Fallow / Loam">Degraded Agricultural Fallow / Loam</option>
                <option value="Heavy Clay / Alluvial Plain">Heavy Clay / Floodplain (Water-retentive)</option>
                <option value="Saline / Silt Coastal Mudflat">Saline / Silt Coastal Mudflat</option>
                <option value="Peatland / Swamp Soil">Peatland / Swamp Soil (Hydric Acidic)</option>
              </select>
            </div>

            {/* Pillar 4: Ambient AQI Slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-700 flex items-center space-x-1">
                  <Wind className="w-3.5 h-3.5 text-rose-500" />
                  <span>4. Air Quality Index (AQI)</span>
                </label>
                <span
                  className="text-[10px] font-extrabold px-2 py-0.5 rounded-md"
                  style={{ backgroundColor: aqiBadge.bg, color: aqiBadge.color }}
                >
                  AQI {envParams.ambient_aqi} • {aqiBadge.label}
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="400"
                step="5"
                value={envParams.ambient_aqi}
                onChange={(e) => onUpdateEnvParam('ambient_aqi', parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-forest-leaf"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-0.5">
                <span>20 (Pristine)</span>
                <span>150 (Unhealthy)</span>
                <span>300 (Hazardous)</span>
                <span>400+</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. 🧠 Machine Learning Engine & Species Hub Card */}
        <div className="bg-gradient-to-br from-forest-deep via-forest-medium to-forest-pine text-white rounded-2xl p-4 shadow-organic space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-forest-mint animate-pulse" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-forest-pale">
                ML Model & 45+ Flora Hub
              </h4>
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
              R² = 88.5%
            </span>
          </div>

          <p className="text-[11px] text-forest-pale/90 leading-relaxed">
            Multi-output ExtraTrees regression ensemble predicts suitability, crop yield, survival probability, carbon storage, and optimal planting density.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={onOpenCatalog}
              className="py-2 px-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-left border border-white/15 transition-all group"
            >
              <div className="flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 text-forest-mint" />
                <span className="text-[11px] font-bold text-white group-hover:text-forest-mint">
                  45+ Flora Catalog
                </span>
              </div>
              <span className="text-[9px] text-forest-pale/80 block mt-0.5">
                Trees, cereals & cash crops
              </span>
            </button>

            <button
              onClick={onOpenMLDiagnostics}
              className="py-2 px-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-left border border-white/15 transition-all group"
            >
              <div className="flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-[11px] font-bold text-white group-hover:text-amber-200">
                  ML Telemetry & Retrain
                </span>
              </div>
              <span className="text-[9px] text-forest-pale/80 block mt-0.5">
                Inspect metrics & retrain
              </span>
            </button>
          </div>
        </div>

        {/* 4. Satellite Afforestation Gauge & Spectral Analysis */}
        <div className="bg-white rounded-2xl p-4 border border-forest-200/70 shadow-organic space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <Trees className="w-4 h-4 text-forest-medium" />
              <h4 className="text-xs font-bold text-forest-deep uppercase tracking-wider">
                Satellite NDVI & Forest Cover
              </h4>
            </div>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: afforestationScore < 30 ? '#fee2e2' : afforestationScore < 60 ? '#fef3c7' : '#dcfce7',
                color: afforestationScore < 30 ? '#d90429' : afforestationScore < 60 ? '#b45309' : '#15803d'
              }}
            >
              {roi.status_badge || (afforestationScore < 30 ? 'Low Canopy' : 'Moderate Canopy')}
            </span>
          </div>

          {/* SVG Gauge & Stats */}
          <div className="flex items-center justify-around py-2">
            <div className="relative flex items-center justify-center">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  stroke="#e2e8f0"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  stroke={afforestationScore < 30 ? '#d90429' : afforestationScore < 60 ? '#f77f00' : '#2d6a4f'}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-forest-deep tracking-tight">
                  {afforestationScore}%
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                  Canopy
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-forest-50/60 p-2 rounded-xl border border-forest-100">
                <span className="text-[10px] text-slate-400 block font-medium">Mean NDVI Index</span>
                <span className="font-extrabold text-forest-deep text-sm">{meanNdvi}</span>
                <span className="text-[9px] text-slate-500 block">B8 NIR / B4 Red</span>
              </div>

              <div className="bg-forest-50/60 p-2 rounded-xl border border-forest-100">
                <span className="text-[10px] text-slate-400 block font-medium">Total Area</span>
                <span className="font-extrabold text-forest-deep text-sm">{roi.total_area_ha || 0} ha</span>
                <span className="text-[9px] text-slate-500 block">({roi.total_area_sq_km || 0} km²)</span>
              </div>
            </div>
          </div>

          {/* LULC Composition Multi-Bar */}
          <div className="w-full bg-slate-100 rounded-full h-3 flex overflow-hidden shadow-inner">
            <div
              className="bg-[#1b4332] h-full transition-all duration-500"
              style={{ width: `${breakdown.dense_forest?.pct || 10}%` }}
              title={`Dense Forest: ${breakdown.dense_forest?.pct}%`}
            />
            <div
              className="bg-[#52b788] h-full transition-all duration-500"
              style={{ width: `${breakdown.moderate_forest?.pct || 10}%` }}
              title={`Moderate Canopy: ${breakdown.moderate_forest?.pct}%`}
            />
            <div
              className="bg-[#fcbf49] h-full transition-all duration-500"
              style={{ width: `${breakdown.sparse_vegetation?.pct || 25}%` }}
              title={`Sparse Scrub: ${breakdown.sparse_vegetation?.pct}%`}
            />
            <div
              className="bg-[#d90429] h-full transition-all duration-500"
              style={{ width: `${breakdown.barren_soil?.pct || 50}%` }}
              title={`Barren / Bare Soil: ${breakdown.barren_soil?.pct}%`}
            />
            <div
              className="bg-[#1e6091] h-full transition-all duration-500"
              style={{ width: `${breakdown.water_bodies?.pct || 5}%` }}
              title={`Water Bodies: ${breakdown.water_bodies?.pct}%`}
            />
          </div>

          {/* Breakdown Legend Items */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#1b4332]" />
                <span className="text-slate-700 font-medium text-[11px]">Dense Forest</span>
              </div>
              <span className="font-bold text-slate-900">{breakdown.dense_forest?.pct || 0}%</span>
            </div>

            <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#52b788]" />
                <span className="text-slate-700 font-medium text-[11px]">Moderate Canopy</span>
              </div>
              <span className="font-bold text-slate-900">{breakdown.moderate_forest?.pct || 0}%</span>
            </div>

            <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#fcbf49]" />
                <span className="text-slate-700 font-medium text-[11px]">Sparse Scrub</span>
              </div>
              <span className="font-bold text-slate-900">{breakdown.sparse_vegetation?.pct || 0}%</span>
            </div>

            <div className="flex items-center justify-between p-1.5 rounded-lg bg-rose-50/60 border border-rose-100">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#d90429]" />
                <span className="text-rose-900 font-bold text-[11px]">Barren Wasteland</span>
              </div>
              <span className="font-extrabold text-rose-700">{breakdown.barren_soil?.pct || 0}%</span>
            </div>
          </div>
        </div>

        {/* 5. Candidate Suitable Land Parcels Section */}
        <div className="bg-white rounded-2xl p-4 border border-forest-200/70 shadow-organic space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-forest-medium" />
              <h4 className="text-xs font-bold text-forest-deep uppercase tracking-wider">
                Allocatable Planting Areas
              </h4>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              {summary.suitable_parcels_count || parcels.length} Areas Identified
            </span>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            OSM spatial exclusion applied: Water bodies and private/residential lands filtered out. Click any area to view its location, definition and recommended trees to plant.
          </p>

          {/* Parcel Cards List */}
          <div className="space-y-2.5">
            {parcels.map((parcel) => {
              const props = parcel.properties;
              const isSelected = selectedParcel?.properties?.id === props.id;
              const topSpecies = props.recommended_species?.[0];
              const poly = parcel.geometry?.coordinates?.[0] || [];
              const centroidLat = poly.length ? (poly.reduce((s, p) => s + p[1], 0) / poly.length) : null;
              const centroidLng = poly.length ? (poly.reduce((s, p) => s + p[0], 0) / poly.length) : null;

              return (
                <div
                  key={props.id}
                  onClick={() => onSelectParcel(parcel)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${isSelected
                      ? 'bg-forest-50 border-forest-medium shadow-organic-lg ring-2 ring-forest-leaf/40'
                      : 'bg-white hover:bg-forest-50/50 border-forest-200/70 hover:border-forest-400 shadow-sm'
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-forest-pale text-forest-deep border border-forest-mint">
                          {props.id}
                        </span>
                        <h5 className="font-bold text-xs text-forest-deep">{props.name}</h5>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{props.ownership}</p>
                      {centroidLat !== null && (
                        <p className="text-[10px] text-slate-400 mt-0.5">Location: {centroidLat.toFixed(4)}, {centroidLng.toFixed(4)}</p>
                      )}
                      {props.land_type && (
                        <p className="text-[10px] text-slate-400 mt-0.5">Definition: {props.land_type}</p>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-extrabold text-forest-deep block">
                        {props.area_ha} ha
                      </span>
                      <span className="text-[10px] text-slate-400">
                        ({props.area_acres} ac)
                      </span>
                    </div>
                  </div>

                  {/* Micro-Env Tags */}
                  <div className="flex items-center flex-wrap gap-1.5 mt-2 pt-2 border-t border-forest-100 text-[10px]">
                    <span
                      className="px-1.5 py-0.5 rounded font-medium flex items-center space-x-1"
                      style={{ backgroundColor: `${props.env_params?.slope_color}15`, color: props.env_params?.slope_color }}
                    >
                      <Mountain className="w-3 h-3" />
                      <span>{props.env_params?.slope_deg}° Slope</span>
                    </span>

                    <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-medium flex items-center space-x-1 border border-amber-200/50">
                      <Wind className="w-3 h-3 text-amber-600" />
                      <span>AQI {props.env_params?.ambient_aqi}</span>
                    </span>

                    <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 font-medium flex items-center space-x-1 border border-blue-200/50">
                      <Droplets className="w-3 h-3 text-blue-600" />
                      <span>{props.env_params?.nearest_water_m}m to water</span>
                    </span>
                  </div>

                  {/* Top Recommended Species Match Pill */}
                  {topSpecies && (
                    <div className="mt-2 flex items-center justify-between bg-emerald-50/80 p-1.5 rounded-lg border border-emerald-200/60">
                      <div className="flex items-center space-x-1.5 truncate">
                        <span className="text-sm">{topSpecies.icon}</span>
                        <span className="text-[11px] font-bold text-forest-deep truncate">
                          {topSpecies.common_name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 shrink-0 ml-1">
                        <span className="text-[9px] bg-purple-100 text-purple-900 font-bold px-1.5 py-0.2 rounded">
                          ML {topSpecies.ml_confidence_pct || 98}%
                        </span>
                        <span className="text-[10px] font-extrabold text-emerald-800">
                          {topSpecies.match_score}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. Recommended Species Quick Overview */}
        {selectedParcel && (
          <div className="bg-white rounded-2xl p-4 border border-forest-200/70 shadow-organic space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <Leaf className="w-4 h-4 text-forest-medium" />
                <h4 className="text-xs font-bold text-forest-deep uppercase tracking-wider">
                  4-Pillar Recommended Plants & Crops
                </h4>
              </div>
              <button
                onClick={onOpenSpeciesModal}
                className="text-[11px] font-bold text-forest-600 hover:text-forest-deep flex items-center space-x-0.5 hover:underline"
              >
                <span>Full Guide</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {(() => {
              const poly = selectedParcel.geometry?.coordinates?.[0] || [];
              const cLat = poly.length ? (poly.reduce((s, p) => s + p[1], 0) / poly.length) : null;
              const cLng = poly.length ? (poly.reduce((s, p) => s + p[0], 0) / poly.length) : null;
              const treeList = (selectedParcel.properties?.recommended_species || []).slice(0, 4);

              return (
                <div className="space-y-3">
                  <div className="text-[11px] text-slate-500 space-y-0.5">
                    <p><strong>Sector:</strong> {selectedParcel.properties?.name} {cLat !== null && `(Lat: ${cLat.toFixed(4)}, Lng: ${cLng.toFixed(4)})`}</p>
                    <p><strong>Zoning:</strong> {selectedParcel.properties?.land_type || selectedParcel.properties?.focus || 'Cultivable Soil'}</p>
                  </div>

                  <div className="space-y-2 mt-2">
                    {treeList.map((sp) => {
                      const icon = sp.icon || (sp.category?.includes('Tree') ? '🌳' : sp.category?.includes('Crop') ? '🌾' : '🌿');
                      return (
                        <div
                          key={sp.species_id || sp.id || sp.botanical_name}
                          className="p-2.5 rounded-xl bg-forest-50/70 border border-forest-200/90 space-y-1.5 hover:border-emerald-400 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-xl p-1.5 rounded-xl bg-white shadow-sm border border-emerald-100 flex items-center justify-center shrink-0">
                                {icon}
                              </span>
                              <div>
                                <h6 className="font-bold text-xs text-forest-deep">{sp.common_name || sp.species}</h6>
                                <p className="text-[10px] italic text-slate-500">{sp.botanical_name}</p>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-xs font-black text-emerald-700 block">
                                {sp.match_score || 94}% Match
                              </span>
                              <span className="text-[9px] uppercase text-purple-800 font-bold bg-purple-100 px-1 py-0.2 rounded">
                                ML {sp.ml_confidence_pct || 98}%
                              </span>
                            </div>
                          </div>

                          {/* Density & Carbon mini chips */}
                          <div className="flex items-center justify-between text-[9px] text-forest-700 bg-white/80 px-2 py-1 rounded-md border border-forest-100">
                            <span><strong>{sp.predicted_yield_t_ha ? `${sp.predicted_yield_t_ha} t/ha yield` : `${sp.optimal_density_ha || 1000} /ha`}</strong></span>
                            <span><strong>+{sp.carbon_sequestration_t_ha_yr || 8.5}</strong> tCO₂e/ha</span>
                            <span><strong>{sp.survival_rate_pct || 92}%</strong> Survival</span>
                          </div>

                          {/* Mini 4-Pillar Compatibility Badges */}
                          {sp.pillars && (
                            <div className="grid grid-cols-4 gap-1 text-[9px] pt-1 border-t border-forest-100">
                              <div className="bg-white/80 p-1 rounded text-center border border-forest-100">
                                <span className="text-slate-400 block">Climate</span>
                                <span className="font-bold text-forest-deep">{sp.pillars.climate?.score || 95}%</span>
                              </div>
                              <div className="bg-white/80 p-1 rounded text-center border border-forest-100">
                                <span className="text-slate-400 block">Water</span>
                                <span className="font-bold text-forest-deep">{sp.pillars.water?.score || 90}%</span>
                              </div>
                              <div className="bg-white/80 p-1 rounded text-center border border-forest-100">
                                <span className="text-slate-400 block">Land</span>
                                <span className="font-bold text-forest-deep">{sp.pillars.land?.score || 96}%</span>
                              </div>
                              <div className="bg-white/80 p-1 rounded text-center border border-forest-100">
                                <span className="text-slate-400 block">AQI</span>
                                <span className="font-bold text-forest-deep">{sp.pillars.aqi?.score || 92}%</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

      </div>
    </aside>
  );
}

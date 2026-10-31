import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Sprout,
  Wheat,
  Trees,
  Leaf,
  Droplets,
  Sun,
  Mountain,
  Wind,
  Sparkles,
  TrendingUp,
  Award,
  DollarSign,
  Layers,
  Sliders,
  RefreshCw,
  Cpu,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BarChart2,
  Calendar,
  Flame,
  Zap,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { predictCropAdvisory, CLIENT_SPECIES_CATALOG } from '../api/client';

const SOIL_PRESETS = [
  {
    id: 'fertile-loam',
    name: '🌱 Fertile Alluvial Loam',
    desc: 'High organic matter, balanced nutrients',
    params: { nitrogen: 110, phosphorus: 60, potassium: 75, soil_ph: 6.8, rainfall_mm: 900, temperature_c: 25, humidity_pct: 70, soil_organic_carbon: 2.2 }
  },
  {
    id: 'nitrogen-depleted',
    name: '🌾 Nitrogen-Depleted Dryland',
    desc: 'Semi-arid fallow land needing legume rotation',
    params: { nitrogen: 25, phosphorus: 30, potassium: 45, soil_ph: 7.6, rainfall_mm: 480, temperature_c: 31, humidity_pct: 45, soil_organic_carbon: 0.6 }
  },
  {
    id: 'acidic-hill',
    name: '⛰️ Acidic High-Rainfall Escarpment',
    desc: 'Montane slopes prone to nutrient leaching',
    params: { nitrogen: 70, phosphorus: 20, potassium: 35, soil_ph: 5.4, rainfall_mm: 1800, temperature_c: 20, humidity_pct: 85, soil_organic_carbon: 2.8 }
  },
  {
    id: 'alkaline-semiarid',
    name: '☀️ Alkaline Calcareous Plain',
    desc: 'Low rainfall, high pH, drought-resilient crops needed',
    params: { nitrogen: 45, phosphorus: 25, potassium: 80, soil_ph: 8.3, rainfall_mm: 400, temperature_c: 33, humidity_pct: 35, soil_organic_carbon: 0.5 }
  },
  {
    id: 'saline-coastal',
    name: '🌊 Coastal Brackish Margin',
    desc: 'Elevated salinity, high humidity, moderate rain',
    params: { nitrogen: 60, phosphorus: 35, potassium: 50, soil_ph: 7.9, rainfall_mm: 1200, temperature_c: 28, humidity_pct: 80, soil_organic_carbon: 1.2 }
  }
];

const CATEGORY_TABS = [
  { id: 'all', label: 'All Recommendations', icon: '🌟' },
  { id: 'cereals', label: 'Cereals & Grains', icon: '🌾' },
  { id: 'pulses', label: 'Pulses & Legumes', icon: '🌱' },
  { id: 'cash_crops', label: 'Cash Crops', icon: '💰' },
  { id: 'horticulture', label: 'Fruits & Horticulture', icon: '🥭' },
  { id: 'agroforestry_trees', label: 'Agroforestry Trees', icon: '🌳' }
];

export default function CropAdvisorModal({ onClose, initialEnv = null, inline = false }) {
  const [params, setParams] = useState({
    nitrogen: 75,
    phosphorus: 40,
    potassium: 45,
    soil_ph: 6.8,
    soil_organic_carbon: 1.5,
    rainfall_mm: 650,
    temperature_c: 26,
    humidity_pct: 60,
    climate: initialEnv?.climate_zone || 'Semi-Arid Subtropical',
    water_type: initialEnv?.water_type || 'Freshwater River / Canal',
    land_type: initialEnv?.land_type || 'Degraded Agricultural Fallow / Loam',
    ambient_aqi: initialEnv?.ambient_aqi || 135,
    crop_category: 'all'
  });

  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [predictionData, setPredictionData] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Trigger prediction
  const runPrediction = async (currentParams = params, category = activeTab) => {
    setIsLoading(true);
    try {
      const payload = {
        ...currentParams,
        crop_category: category,
        top_k: 12
      };
      const res = await predictCropAdvisory(payload);
      setPredictionData(res);
      if (res?.recommendations?.length > 0) {
        setSelectedItem(res.recommendations[0]);
      }
    } catch (err) {
      console.error('Crop prediction error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runPrediction(params, activeTab);
  }, []);

  const handleParamChange = (key, value) => {
    const updated = { ...params, [key]: value };
    setParams(updated);
  };

  const handlePresetSelect = (preset) => {
    const updated = { ...params, ...preset.params };
    setParams(updated);
    runPrediction(updated, activeTab);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    runPrediction(params, tabId);
  };

  const soilDiagnosis = predictionData?.soil_health_diagnosis;
  const agroforestryPairing = predictionData?.agroforestry_pairing;
  const recommendations = predictionData?.recommendations || [];

  const dialog = (
    <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-forest-200 overflow-hidden animate-slide-up">
      {/* Header */}
        <div className="p-5 md:p-6 bg-gradient-to-r from-forest-deep via-forest-medium to-emerald-800 text-white flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="p-1.5 rounded-lg bg-white/15 backdrop-blur-md">
                <Sprout className="w-5 h-5 text-emerald-300 animate-bounce-gentle" />
              </span>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-forest-pale border border-white/20">
                45+ Species AI Agronomy Engine
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-400/25 text-emerald-200 border border-emerald-400/40 flex items-center space-x-1">
                <Cpu className="w-3.5 h-3.5" />
                <span>Multi-Target ExtraTrees (R²: 88.5%)</span>
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>🌾 Advanced Crop & Agroforestry Prediction Engine</span>
            </h2>
            <p className="text-xs text-forest-pale/90 max-w-3xl">
              Simulate soil N-P-K nutrient chemistry, thermal/rainfall regimes, and pH to receive precision crop recommendations, predicted harvest yields, fertilizer balancing, and alley-cropping intercropping designs.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all shrink-0 ml-3"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content: Left Simulator Panel (38%) + Right Prediction Results (62%) */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#fbfcf8]">
          
          {/* Left Soil & Agronomy Control Column */}
          <div className="w-full lg:w-[410px] p-5 overflow-y-auto border-r border-forest-200/80 bg-white/95 space-y-4 shadow-sm">
            
            {/* Quick Soil Biome Presets */}
            <div className="grid grid-cols-1 gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-forest-deep uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Quick Soil Presets</span>
                </span>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {SOIL_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className="w-full text-left p-2 rounded-xl bg-forest-50/70 hover:bg-forest-100/80 border border-forest-200/70 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <p className="text-xs font-bold text-forest-deep group-hover:text-emerald-800">
                        {preset.name}
                      </p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{preset.desc}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-forest-200">
                      Apply
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-forest-100" />

            {/* Precision N-P-K Nutrients */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-forest-deep uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Soil N-P-K Macro-Nutrients</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  kg / hectare
                </span>
              </div>

              {/* Nitrogen */}
              <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200/70">
                <div className="flex justify-between items-center text-xs font-bold text-emerald-950 mb-1">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>Nitrogen (N)</span>
                  </span>
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-900">
                    {params.nitrogen} kg/ha
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="180"
                  step="5"
                  value={params.nitrogen}
                  onChange={(e) => handleParamChange('nitrogen', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                />
                <div className="flex justify-between text-[9px] text-emerald-700 font-semibold mt-1">
                  <span>Deficient (10)</span>
                  <span>Optimal (80-120)</span>
                  <span>Excess (160+)</span>
                </div>
              </div>

              {/* Phosphorus */}
              <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/70">
                <div className="flex justify-between items-center text-xs font-bold text-amber-950 mb-1">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                    <span>Phosphorus (P)</span>
                  </span>
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 text-amber-900">
                    {params.phosphorus} kg/ha
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={params.phosphorus}
                  onChange={(e) => handleParamChange('phosphorus', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <div className="flex justify-between text-[9px] text-amber-700 font-semibold mt-1">
                  <span>Low (15)</span>
                  <span>Balanced (40-60)</span>
                  <span>High (100+)</span>
                </div>
              </div>

              {/* Potassium */}
              <div className="bg-purple-50/50 p-2.5 rounded-xl border border-purple-200/70">
                <div className="flex justify-between items-center text-xs font-bold text-purple-950 mb-1">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                    <span>Potassium (K)</span>
                  </span>
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-purple-300 text-purple-900">
                    {params.potassium} kg/ha
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  step="5"
                  value={params.potassium}
                  onChange={(e) => handleParamChange('potassium', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-[9px] text-purple-700 font-semibold mt-1">
                  <span>Low (20)</span>
                  <span>Optimal (45-80)</span>
                  <span>High (120+)</span>
                </div>
              </div>
            </div>

            {/* Soil pH & Organic Carbon */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-forest-50/60 p-2.5 rounded-xl border border-forest-200">
                <div className="flex justify-between text-xs font-bold text-forest-deep mb-1">
                  <span>Soil pH</span>
                  <span className="font-mono text-emerald-800">{params.soil_ph}</span>
                </div>
                <input
                  type="range"
                  min="4.5"
                  max="9.0"
                  step="0.1"
                  value={params.soil_ph}
                  onChange={(e) => handleParamChange('soil_ph', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-forest-200 rounded-lg appearance-none cursor-pointer accent-forest-leaf"
                />
                <span className="text-[9px] text-slate-500 font-medium block mt-1">
                  {params.soil_ph < 6.0 ? 'Acidic' : params.soil_ph > 7.8 ? 'Alkaline' : 'Neutral (Ideal)'}
                </span>
              </div>

              <div className="bg-forest-50/60 p-2.5 rounded-xl border border-forest-200">
                <div className="flex justify-between text-xs font-bold text-forest-deep mb-1">
                  <span>Organic Carbon</span>
                  <span className="font-mono text-emerald-800">{params.soil_organic_carbon}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="4.0"
                  step="0.1"
                  value={params.soil_organic_carbon}
                  onChange={(e) => handleParamChange('soil_organic_carbon', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-forest-200 rounded-lg appearance-none cursor-pointer accent-forest-leaf"
                />
                <span className="text-[9px] text-slate-500 font-medium block mt-1">
                  {params.soil_organic_carbon < 0.75 ? 'Low SOC' : 'High SOC'}
                </span>
              </div>
            </div>

            {/* Climate & Weather Sliders */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-extrabold text-forest-deep uppercase tracking-wider block">
                🌦️ Thermal & Hydrological Matrix
              </span>

              {/* Temperature & Rainfall */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span className="flex items-center gap-1">
                      <Sun className="w-3 h-3 text-amber-500" />
                      <span>Temp</span>
                    </span>
                    <span className="font-mono text-amber-800">{params.temperature_c}°C</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="45"
                    step="1"
                    value={params.temperature_c}
                    onChange={(e) => handleParamChange('temperature_c', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-blue-500" />
                      <span>Rainfall</span>
                    </span>
                    <span className="font-mono text-blue-800">{params.rainfall_mm} mm</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="2400"
                    step="50"
                    value={params.rainfall_mm}
                    onChange={(e) => handleParamChange('rainfall_mm', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Run Prediction Button */}
            <button
              onClick={() => runPrediction(params, activeTab)}
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-forest-deep to-emerald-700 hover:from-forest-medium hover:to-emerald-600 text-white text-xs font-black rounded-xl shadow-organic hover:shadow-organic-lg flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Computing Ensemble Inference...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>Re-Calculate Crop Matchmaking</span>
                </>
              )}
            </button>
          </div>

          {/* Right Results & Strategy Column */}
          <div className="flex-1 p-5 overflow-y-auto space-y-5">
            
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 bg-white p-1.5 rounded-2xl border border-forest-200 shadow-sm">
              {CATEGORY_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    activeTab === tab.id
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-forest-50 hover:text-forest-deep'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Agroforestry Intercropping Strategy Hero Banner */}
            {agroforestryPairing && (
              <div className="bg-gradient-to-br from-forest-900 via-forest-800 to-emerald-950 text-white rounded-2xl p-4 border border-emerald-600/40 shadow-organic relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 text-white pointer-events-none">
                  <Trees className="w-36 h-36" />
                </div>

                <div className="relative z-10 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                      ★ High Synergy Alley Intercropping
                    </span>
                    <span className="text-[10px] font-bold text-forest-pale">
                      +{agroforestryPairing.combined_carbon_t_ha_yr} tCO₂e/ha/yr Sequestration
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold tracking-tight text-white">
                    {agroforestryPairing.system_name}
                  </h3>

                  <p className="text-xs text-forest-pale/90 leading-relaxed">
                    {agroforestryPairing.spatial_design}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                    <div className="bg-white/10 px-3 py-1 rounded-lg border border-white/15">
                      <span className="text-forest-mint font-semibold">Canopy Shield:</span>{' '}
                      <span className="font-extrabold text-white">{agroforestryPairing.canopy_tree}</span>
                    </div>
                    <div className="bg-white/10 px-3 py-1 rounded-lg border border-white/15">
                      <span className="text-emerald-300 font-semibold">Understory Crop:</span>{' '}
                      <span className="font-extrabold text-white">{agroforestryPairing.understory_crop}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Soil Health Diagnosis Strip */}
            {soilDiagnosis && (
              <div className="bg-white rounded-2xl p-3.5 border border-forest-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-forest-deep">Soil Chemistry:</span>
                  <span className="text-slate-600">{soilDiagnosis.ph_classification} • {soilDiagnosis.npk_summary}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    SOC: {soilDiagnosis.organic_carbon_rating}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    Retention: {soilDiagnosis.water_retention_capacity}
                  </span>
                </div>
              </div>
            )}

            {/* Ranked Crop & Tree Cards Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Top Recommended Flora ({recommendations.length} Matches)
                </h4>
                <span className="text-[10px] text-slate-400 font-medium">
                  Ranked by ML Multi-Target Fit
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {recommendations.map((crop, idx) => (
                  <div
                    key={crop.species_id || crop.id || idx}
                    onClick={() => setSelectedItem(crop)}
                    className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer shadow-sm hover:shadow-organic flex flex-col justify-between space-y-3 ${
                      selectedItem?.id === crop.id
                        ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                        : 'border-forest-200/90 hover:border-forest-400'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2.5">
                        <span className="text-2xl p-2 rounded-xl bg-forest-50 border border-forest-100 shadow-sm">
                          {crop.icon || '🌱'}
                        </span>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-extrabold text-forest-deep">
                              #{idx + 1} {crop.common_name}
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-forest-pale text-forest-deep border border-forest-mint">
                              {crop.category}
                            </span>
                          </div>
                          <p className="text-[10px] italic text-slate-500 font-serif">{crop.botanical_name}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-emerald-700">{crop.match_score}%</span>
                        <span className="text-[9px] text-slate-400 block font-bold">Match</span>
                      </div>
                    </div>

                    {/* Key Agronomic Metrics */}
                    <div className="grid grid-cols-3 gap-1.5 bg-forest-50/50 p-2 rounded-xl text-[10px] border border-forest-100">
                      <div className="bg-white p-1.5 rounded-lg text-center">
                        <span className="text-slate-400 block font-medium">Yield</span>
                        <span className="font-extrabold text-emerald-800 text-xs">
                          {crop.predicted_yield_t_ha} t/ha
                        </span>
                      </div>
                      <div className="bg-white p-1.5 rounded-lg text-center">
                        <span className="text-slate-400 block font-medium">Duration</span>
                        <span className="font-extrabold text-forest-deep">
                          {crop.crop_duration_days || 'Seasonal'}
                        </span>
                      </div>
                      <div className="bg-white p-1.5 rounded-lg text-center">
                        <span className="text-slate-400 block font-medium">ROI Tier</span>
                        <span className="font-extrabold text-amber-700">
                          {crop.economic_roi_tier || 'High'}
                        </span>
                      </div>
                    </div>

                    {/* Fertilizer Recommendation */}
                    {crop.fertilizer_recommendation && (
                      <div className="text-[10px] bg-emerald-50/80 p-2 rounded-lg border border-emerald-200/80 text-emerald-950 flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1">
                          <Sprout className="w-3 h-3 text-emerald-700 inline" />
                          <span>Nutrient Balance:</span>
                        </span>
                        <span className="font-semibold text-emerald-800">
                          {crop.fertilizer_recommendation}
                        </span>
                      </div>
                    )}

                    {/* Companions */}
                    {crop.agroforestry_companions && crop.agroforestry_companions.length > 0 && (
                      <div className="text-[10px] text-slate-600 flex items-center space-x-1">
                        <span className="font-bold text-forest-deep">Allies:</span>
                        <span className="truncate">{crop.agroforestry_companions.join(', ')}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Flora Detailed Drawer */}
            {selectedItem && (
              <div className="bg-white rounded-2xl p-5 border border-forest-200 shadow-organic space-y-3">
                <div className="flex items-start justify-between border-b border-forest-100 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl p-2 rounded-2xl bg-forest-50 border border-forest-200">
                      {selectedItem.icon}
                    </span>
                    <div>
                      <h3 className="text-lg font-black text-forest-deep">
                        {selectedItem.common_name} ({selectedItem.botanical_name})
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {selectedItem.category} • {selectedItem.growing_season}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                    {selectedItem.survival_rate_pct}% Harvest Probability
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                    <span className="text-[10px] text-amber-800 font-bold block">Water Demand</span>
                    <span className="font-extrabold text-amber-950">{selectedItem.water_demand}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
                    <span className="text-[10px] text-blue-800 font-bold block">Carbon Impact</span>
                    <span className="font-extrabold text-blue-950">{selectedItem.carbon_sequestration_t_ha_yr} t/ha/yr</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-forest-50 border border-forest-200">
                    <span className="text-[10px] text-forest-800 font-bold block">Seed Rate / Density</span>
                    <span className="font-extrabold text-forest-deep">{selectedItem.optimal_density_ha} / ha</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200">
                    <span className="text-[10px] text-purple-800 font-bold block">Economic Value</span>
                    <span className="font-extrabold text-purple-950">{selectedItem.economic_roi_tier} ROI</span>
                  </div>
                </div>

                {selectedItem.planting_guidance && (
                  <div className="bg-forest-50/70 p-3 rounded-xl border border-forest-200">
                    <h5 className="text-[11px] font-bold text-forest-deep uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-forest-leaf" />
                      <span>Cultivation & Planting Protocol</span>
                    </h5>
                    <p className="text-xs text-slate-700 leading-relaxed">{selectedItem.planting_guidance}</p>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

  );
}

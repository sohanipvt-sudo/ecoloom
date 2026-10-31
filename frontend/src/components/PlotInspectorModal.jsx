import React from 'react';
import { 
  X, 
  Leaf, 
  Mountain, 
  Wind, 
  Droplets, 
  Sun, 
  ShieldCheck, 
  Compass, 
  TrendingUp, 
  Calendar, 
  Layers, 
  Sparkles, 
  TreePine, 
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  Zap,
  Sprout,
  DollarSign
} from 'lucide-react';

export default function PlotInspectorModal({ parcel, onClose, onOpenCropAdvisor }) {
  if (!parcel) return null;

  const props = parcel.properties || {};
  const env = props.env_params || {};
  const speciesList = props.recommended_species || [];

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-forest-200 overflow-hidden animate-slide-up">
        
        {/* Header with Area / Ward info */}
        <div className="p-5 bg-gradient-to-r from-forest-deep via-forest-medium to-forest-pine text-white flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-forest-pale">
                {props.id || parcel.properties?.ward_number || parcel.properties?.ward || 'Ward ID'}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                ★ {props.suitability_score}% Land Suitability
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/10 text-forest-mint border border-white/20 flex items-center space-x-1">
                <Cpu className="w-3 h-3" />
                <span>ML Multi-Target Ensemble (R²: 88.5%)</span>
              </span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">{props.name || parcel.properties?.name || 'Selected Area'}</h2>
            <p className="text-xs text-forest-pale/90">
              {parcel.properties?.municipality || parcel.properties?.region || ''} {parcel.properties?.state ? ` • ${parcel.properties.state}` : ''} {parcel.properties?.country ? ` • ${parcel.properties.country}` : ''}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 bg-[#fbfcf8]">
          
          {/* 1. Spatial & Micro-Environmental Telemetry */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Micro-Environmental & Agronomic Telemetry
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Climate */}
              <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-200/80">
                <span className="text-[10px] text-amber-800 font-bold uppercase block flex items-center space-x-1">
                  <Sun className="w-3 h-3 text-amber-600 inline" />
                  <span>Climate Zone</span>
                </span>
                <span className="text-sm font-black text-amber-950 block truncate mt-1">
                  {env.climate_zone || 'Semi-Arid'}
                </span>
                <span className="text-[10px] text-amber-700 block font-medium">
                  {env.annual_rainfall_mm || 650} mm rain/yr
                </span>
              </div>

              {/* Water Type */}
              <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-200/80">
                <span className="text-[10px] text-blue-800 font-bold uppercase block flex items-center space-x-1">
                  <Droplets className="w-3 h-3 text-blue-600 inline" />
                  <span>Water Regime</span>
                </span>
                <span className="text-sm font-black text-blue-950 block truncate mt-1">
                  {env.water_type?.split('/')[0] || 'Groundwater'}
                </span>
                <span className="text-[10px] text-blue-700 block truncate font-medium">
                  {env.nearest_water_m}m to water
                </span>
              </div>

              {/* Land & Slope */}
              <div className="bg-forest-50/70 p-3 rounded-2xl border border-forest-200/80">
                <span className="text-[10px] text-forest-800 font-bold uppercase block flex items-center space-x-1">
                  <Mountain className="w-3 h-3 text-forest-medium inline" />
                  <span>Land & Soil</span>
                </span>
                <span className="text-sm font-black text-forest-deep block truncate mt-1">
                  {env.slope_deg}° Slope
                </span>
                <span className="text-[10px] text-forest-700 block truncate font-medium">
                  pH {env.soil_ph} • {env.soil_organic_carbon || 0.65}% SOC
                </span>
              </div>

              {/* AQI */}
              <div className="bg-rose-50/70 p-3 rounded-2xl border border-rose-200/80">
                <span className="text-[10px] text-rose-800 font-bold uppercase block flex items-center space-x-1">
                  <Wind className="w-3 h-3 text-rose-600 inline" />
                  <span>Air Quality (AQI)</span>
                </span>
                <span className="text-sm font-black text-rose-950 block mt-1">
                  AQI {env.ambient_aqi}
                </span>
                <span className="text-[10px] text-rose-700 block font-semibold">
                  PM2.5: {env.aqi_breakdown?.pm25 || 65} µg/m³
                </span>
              </div>
            </div>
          </div>

          {/* Quick Trigger to Deep Crop Advisor */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-forest-50 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Sprout className="w-5 h-5 text-emerald-700" />
              <div>
                <p className="text-xs font-extrabold text-emerald-950">
                  Simulate Crops, N-P-K Fertilizer & Intercropping
                </p>
                <p className="text-[10px] text-emerald-800">
                  Run precision nutrient dosage and alley-cropping forecasts for this plot.
                </p>
              </div>
            </div>

            {onOpenCropAdvisor && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCropAdvisor(env);
                }}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all shrink-0"
              >
                Launch Advisor
              </button>
            )}
          </div>

          {/* 2. Ranked Native Species & Crops Matchmaking */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Recommended Native Flora & Crops ({speciesList.length} Matches)
                </h3>
                <p className="text-xs text-slate-600">
                  Ranked by Multi-Target ML Regressor across Soil Chemistry, Moisture, and Thermal Tolerance.
                </p>
              </div>
              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                <span>{speciesList.length} Matches</span>
              </span>
            </div>

            <div className="space-y-4">
              {speciesList.map((sp, idx) => (
                <div 
                  key={sp.species_id || sp.id || idx}
                  className="bg-white rounded-2xl p-4 border border-forest-200/90 shadow-organic hover:border-forest-400 transition-all space-y-3"
                >
                  {/* Title Bar */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-forest-50 border border-forest-200 flex items-center justify-center text-2xl shadow-sm">
                        {sp.icon}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-extrabold text-forest-deep">
                            #{idx + 1} {sp.common_name}
                          </span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-forest-pale text-forest-deep">
                            {sp.category}
                          </span>
                        </div>
                        <p className="text-xs italic text-slate-500 font-serif">{sp.botanical_name}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-baseline space-x-1 justify-end">
                        <span className="text-base font-black text-emerald-700">{sp.match_score}%</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Match</span>
                      </div>
                      <div className="flex items-center justify-end space-x-1.5 mt-0.5">
                        <span className="text-[10px] font-bold text-forest-700">
                          {sp.survival_rate_pct}% Survival
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">
                          ML {sp.ml_confidence_pct || 98}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ML Multi-Target Yield Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-forest-50/50 p-2.5 rounded-xl border border-forest-100 text-[10px]">
                    <div className="bg-white p-2 rounded-lg border border-forest-100 text-center">
                      <span className="text-slate-400 block font-medium">Expected Yield</span>
                      <span className="font-extrabold text-emerald-700 text-xs">
                        {sp.predicted_yield_t_ha ? `${sp.predicted_yield_t_ha} t/ha` : 'High'}
                      </span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-forest-100 text-center">
                      <span className="text-slate-400 block font-medium">Duration</span>
                      <span className="font-extrabold text-forest-deep text-xs">
                        {sp.crop_duration_days || 'Perennial'}
                      </span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-forest-100 text-center">
                      <span className="text-slate-400 block font-medium">Carbon Capture</span>
                      <span className="font-extrabold text-forest-deep text-xs">
                        {sp.carbon_sequestration_t_ha_yr} t/ha/yr
                      </span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-forest-100 text-center">
                      <span className="text-slate-400 block font-medium">ROI Rating</span>
                      <span className="font-extrabold text-amber-700 text-xs">
                        {sp.economic_roi_tier || 'High Tier'}
                      </span>
                    </div>
                  </div>

                  {/* Fertilizer & Nutrient Balance */}
                  {sp.fertilizer_recommendation && (
                    <div className="text-xs bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200 flex items-center justify-between text-emerald-950">
                      <span className="font-bold flex items-center gap-1">
                        <Sprout className="w-3.5 h-3.5 text-emerald-700 inline" />
                        <span>Fertilizer Advisory:</span>
                      </span>
                      <span className="font-semibold text-emerald-900">{sp.fertilizer_recommendation}</span>
                    </div>
                  )}

                  {/* Agroforestry Companions */}
                  {sp.agroforestry_companions && sp.agroforestry_companions.length > 0 && (
                    <div className="text-xs text-slate-600 flex items-center space-x-1.5">
                      <span className="font-bold text-forest-deep">Agroforestry Companions:</span>
                      <span className="text-emerald-800 font-semibold">{sp.agroforestry_companions.join(', ')}</span>
                    </div>
                  )}

                  {/* 4-Pillar Score Breakdown Badges */}
                  {sp.pillars && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-xl text-xs border border-slate-100">
                      <div className="bg-white p-2 rounded-lg border border-slate-200/70">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-amber-800 flex items-center space-x-1">
                            <Sun className="w-3 h-3 text-amber-500" />
                            <span>Climate</span>
                          </span>
                          <span className="font-extrabold text-forest-deep">{sp.pillars.climate?.score}%</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{sp.pillars.climate?.reason}</p>
                      </div>

                      <div className="bg-white p-2 rounded-lg border border-slate-200/70">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-blue-800 flex items-center space-x-1">
                            <Droplets className="w-3 h-3 text-blue-500" />
                            <span>Water</span>
                          </span>
                          <span className="font-extrabold text-forest-deep">{sp.pillars.water?.score}%</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{sp.pillars.water?.reason}</p>
                      </div>

                      <div className="bg-white p-2 rounded-lg border border-slate-200/70">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-emerald-800 flex items-center space-x-1">
                            <Mountain className="w-3 h-3 text-emerald-600" />
                            <span>Land & Soil</span>
                          </span>
                          <span className="font-extrabold text-forest-deep">{sp.pillars.land?.score}%</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{sp.pillars.land?.reason}</p>
                      </div>

                      <div className="bg-white p-2 rounded-lg border border-slate-200/70">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-rose-800 flex items-center space-x-1">
                            <Wind className="w-3 h-3 text-rose-500" />
                            <span>AQI Filter</span>
                          </span>
                          <span className="font-extrabold text-forest-deep">{sp.pillars.aqi?.score}%</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{sp.pillars.aqi?.reason}</p>
                      </div>
                    </div>
                  )}

                  {/* Ecological Benefits */}
                  <div>
                    <span className="text-[11px] font-bold text-forest-800 uppercase block mb-1">
                      Ecological Function & Co-Benefits:
                    </span>
                    <ul className="space-y-1">
                      {sp.ecological_benefits?.map((b, bIdx) => (
                        <li key={bIdx} className="text-xs text-slate-600 flex items-start space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-forest-leaf shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Field planting guidance */}
                  <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs text-amber-900 leading-relaxed">
                    <span className="font-bold text-[11px] uppercase block text-amber-800 mb-0.5">
                      🚜 Field Planting Directive:
                    </span>
                    <p>{sp.planting_guidance}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Total Carbon Potential for Plot: <strong>+{props.potential_carbon_t_yr} tCO₂e / yr</strong>
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-forest-deep hover:bg-forest-medium text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}

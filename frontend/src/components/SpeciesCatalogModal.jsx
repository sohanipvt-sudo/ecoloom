import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Trees,
  Leaf,
  Sun,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { CLIENT_SPECIES_CATALOG } from '../api/client';

export default function SpeciesCatalogModal({ onClose, catalog = CLIENT_SPECIES_CATALOG, inline = false }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClimate, setSelectedClimate] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSpecies, setSelectedSpecies] = useState(null);

  const categories = useMemo(() => {
    const set = new Set();
    catalog.forEach(sp => {
      if (sp.category) set.add(sp.category);
    });
    return ['All', ...Array.from(set)];
  }, [catalog]);

  const climates = [
    'All',
    'Arid / Desert',
    'Semi-Arid Subtropical',
    'Tropical Wet',
    'Montane / Temperate',
    'Mediterranean / Dry Summer',
    'Coastal / Maritime'
  ];

  const filteredSpecies = useMemo(() => {
    return catalog.filter(sp => {
      const matchQuery =
        !searchQuery.trim() ||
        sp.botanical_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sp.common_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sp.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchClimate =
        selectedClimate === 'All' ||
        sp.suitable_climates?.some(c => c.toLowerCase().includes(selectedClimate.toLowerCase()));

      const matchCategory =
        selectedCategory === 'All' ||
        sp.category === selectedCategory;

      return matchQuery && matchClimate && matchCategory;
    });
  }, [catalog, searchQuery, selectedClimate, selectedCategory]);

  const dialog = (
    <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-forest-200 overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-forest-deep via-forest-medium to-forest-pine text-white flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className="p-1.5 rounded-lg bg-white/15 backdrop-blur-md">
              <Trees className="w-5 h-5 text-forest-mint" />
            </span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-forest-pale border border-white/20">
              {catalog.length} Global Species Catalog
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
              Machine Learning Calibrated
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight pt-1">
            Native Species & Tree Flora Catalog
          </h2>
        </div>

        {/* Close button */}
        {onClose && (
          <button
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all shrink-0 ml-4"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-forest-50/50 border-b border-forest-100 flex flex-wrap items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by common name, botanical name, or category..."
            className="w-full pl-9 pr-8 py-2 bg-white text-xs font-medium text-forest-deep placeholder-slate-400 rounded-xl border border-forest-200 focus:outline-none focus:ring-2 focus:ring-forest-leaf/50 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-bold text-slate-600 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5 text-forest-leaf" />
            <span>Category:</span>
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-1.5 px-3 bg-white text-xs font-semibold text-forest-deep rounded-xl border border-forest-200 focus:outline-none focus:ring-2 focus:ring-forest-leaf/50 shadow-sm"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Climate Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-bold text-slate-600 flex items-center space-x-1">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>Climate:</span>
          </span>
          <select
            value={selectedClimate}
            onChange={(e) => setSelectedClimate(e.target.value)}
            className="py-1.5 px-3 bg-white text-xs font-semibold text-forest-deep rounded-xl border border-forest-200 focus:outline-none focus:ring-2 focus:ring-forest-leaf/50 shadow-sm"
          >
            {climates.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Results count pill */}
        <div className="text-xs font-bold text-forest-deep bg-white px-3 py-1.5 rounded-xl border border-forest-200 shadow-sm">
          Showing <span className="text-forest-leaf font-extrabold">{filteredSpecies.length}</span> of {catalog.length} Species
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-[#fbfcf8]">
        {filteredSpecies.map(sp => (
          <div
            key={sp.id}
            onClick={() => setSelectedSpecies(sp)}
            className="bg-white rounded-2xl p-4 border border-forest-200/80 hover:border-forest-400 shadow-sm hover:shadow-organic transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="text-2xl p-2 rounded-xl bg-forest-50/80 border border-forest-100 group-hover:scale-110 transition-transform">
                    {sp.icon || '🌳'}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-forest-deep group-hover:text-forest-leaf transition-colors leading-tight">
                      {sp.common_name}
                    </h4>
                    <p className="text-[11px] italic text-slate-500 font-serif mt-0.5">
                      {sp.botanical_name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-2.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-forest-pale text-forest-deep border border-forest-mint inline-block">
                  {sp.category}
                </span>
              </div>

              <p className="text-[11px] text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                {sp.ecological_benefits?.[0] || 'High-efficiency native ecological restoration anchor.'}
              </p>
            </div>

            {/* Specs Grid */}
            <div className="mt-3 pt-3 border-t border-forest-100 grid grid-cols-3 gap-1.5 text-[10px]">
              <div className="bg-forest-50/60 p-1.5 rounded-lg text-center">
                <span className="text-slate-400 block font-medium">Carbon</span>
                <span className="font-extrabold text-forest-deep">{sp.carbon_sequestration_t_ha_yr} t/ha</span>
              </div>
              <div className="bg-forest-50/60 p-1.5 rounded-lg text-center">
                <span className="text-slate-400 block font-medium">Density</span>
                <span className="font-extrabold text-forest-deep">{sp.optimal_density_ha}/ha</span>
              </div>
              <div className="bg-forest-50/60 p-1.5 rounded-lg text-center">
                <span className="text-slate-400 block font-medium">AQI Score</span>
                <span className="font-extrabold text-emerald-700">{sp.aqi_biofilter_score || 85}/100</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Species Detail Drawer / Sub-Modal */}
      {selectedSpecies && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-forest-300 space-y-4 animate-scale-up">
            <div className="flex items-start justify-between border-b border-forest-100 pb-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl p-2.5 rounded-2xl bg-forest-50 border border-forest-200">
                  {selectedSpecies.icon || '🌳'}
                </span>
                <div>
                  <h3 className="text-xl font-extrabold text-forest-deep">
                    {selectedSpecies.common_name}
                  </h3>
                  <p className="text-xs italic text-slate-500 font-serif">
                    {selectedSpecies.botanical_name}
                  </p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 mt-1 inline-block">
                    {selectedSpecies.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedSpecies(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 4-Pillar Matrix Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80">
                <span className="text-[10px] text-amber-700 font-bold block">Annual Rainfall</span>
                <span className="font-extrabold text-amber-950">
                  {selectedSpecies.min_rainfall_mm || 350} - {selectedSpecies.max_rainfall_mm || 1500} mm
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200/80">
                <span className="text-[10px] text-blue-700 font-bold block">Water Demand</span>
                <span className="font-extrabold text-blue-950">{selectedSpecies.water_demand || 'Moderate'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-forest-50 border border-forest-200/80">
                <span className="text-[10px] text-forest-700 font-bold block">Ideal Soil pH</span>
                <span className="font-extrabold text-forest-deep">
                  {selectedSpecies.ideal_ph_min || 5.5} - {selectedSpecies.ideal_ph_max || 8.5}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200/80">
                <span className="text-[10px] text-purple-700 font-bold block">Max Slope</span>
                <span className="font-extrabold text-purple-950">≤ {selectedSpecies.max_slope_deg || 25}°</span>
              </div>
            </div>

            {/* Key Ecological Benefits */}
            <div>
              <h4 className="text-xs font-bold text-forest-deep uppercase tracking-wider mb-2">
                Key Ecological & Ecosystem Services
              </h4>
              <ul className="space-y-1.5">
                {(selectedSpecies.ecological_benefits || []).map((b, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start space-x-2 bg-forest-50/50 p-2 rounded-xl border border-forest-100">
                    <CheckCircle2 className="w-4 h-4 text-forest-leaf shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Planting & Silvicultural Guidance */}
            <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/80">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center space-x-1">
                <Leaf className="w-3.5 h-3.5 text-amber-700" />
                <span>Silvicultural Planting Guidance</span>
              </h4>
              <p className="text-xs text-amber-900/90 leading-relaxed">
                {selectedSpecies.planting_guidance || 'Prepare standard 45x45cm pits. Space appropriately for root expansion.'}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedSpecies(null)}
                className="py-2 px-5 bg-forest-deep hover:bg-forest-medium text-white text-xs font-bold rounded-xl transition-colors"
              >
                Close Specification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (inline) {
    return dialog;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      {dialog}
    </div>
  );
}
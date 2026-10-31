import React, { useState, useEffect, useRef } from 'react';
import { 
  Trees, 
  Satellite, 
  Sparkles, 
  Download, 
  MapPin, 
  Search,
  ChevronDown,
  Globe,
  Loader2,
  X,
  Cpu,
  BookOpen,
  Sprout
} from 'lucide-react';
import { geocodeLocation } from '../api/client';

export default function Navbar({ 
  presets = [], 
  selectedPreset, 
  onSelectPreset, 
  onSelectCustomLocation, 
  scanData, 
  onOpenExport, 
  onResetDraw,
  onOpenCatalog,
  onOpenMLDiagnostics,
  onOpenCropAdvisor,
  isScanning,
  backendOnline
}) {
  const summary = scanData?.summary || {};
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await geocodeLocation(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
      setShowDropdown(true);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLocation = (loc) => {
    setShowDropdown(false);
    setSearchQuery(loc.display_name?.split(',')[0] || searchQuery);
    onSelectCustomLocation(loc);
  };

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-forest-200/80 px-3 md:px-6 flex items-center justify-between z-30 relative shadow-sm gap-2">
      {/* Brand & Live Satellite Telemetry */}
      <div className="flex items-center space-x-3 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-deep via-forest-medium to-forest-leaf flex items-center justify-center shadow-organic text-white">
          <Trees className="w-6 h-6 animate-pulse-subtle" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-forest-deep via-forest-medium to-forest-pine bg-clip-text text-transparent">
              EcoLoom
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-forest-pale text-forest-deep border border-forest-mint/50">
              v2.0 Agronomy ML
            </span>
          </div>
          <p className="text-[11px] text-slate-500 hidden sm:block">
            Satellite Afforestation, N-P-K Agronomy & ML Crop Allocation
          </p>
        </div>
      </div>

      {/* Global Area Locator Search Bar (Center) */}
      <div className="flex-1 max-w-sm lg:max-w-md relative mx-2" ref={searchRef}>
        <div className="relative">
          <Search className="w-4 h-4 text-forest-700 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search any global area, city or lat, lng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
            className="w-full bg-forest-50/90 hover:bg-forest-50 focus:bg-white text-forest-900 text-xs font-semibold pl-9 pr-8 py-2 rounded-xl border border-forest-300 focus:outline-none focus:ring-2 focus:ring-forest-leaf/50 focus:border-forest-leaf transition-all placeholder:text-slate-400"
          />
          {isSearching ? (
            <Loader2 className="w-4 h-4 text-forest-600 animate-spin absolute right-2.5 top-2.5" />
          ) : searchQuery ? (
            <button 
              onClick={() => { setSearchQuery(''); setSearchResults([]); }}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>

        {/* Autocomplete Dropdown */}
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-forest-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-72 overflow-y-auto divide-y divide-forest-50">
            <div className="px-3 py-1.5 bg-forest-50/70 text-[10px] font-bold text-forest-800 uppercase tracking-wider flex items-center justify-between">
              <span>Geocoded Locations</span>
              <span>{searchResults.length} found</span>
            </div>
            {searchResults.map((loc, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectLocation(loc)}
                className="w-full text-left px-3 py-2.5 hover:bg-forest-50 transition-colors flex items-start space-x-2 group"
              >
                <MapPin className="w-4 h-4 text-forest-600 shrink-0 mt-0.5 group-hover:text-forest-deep" />
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-forest-deep">
                    {loc.display_name}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {loc.lat.toFixed(4)}°, {loc.lon.toFixed(4)}° {loc.inferred_env?.climate_zone ? `• ${loc.inferred_env.climate_zone}` : ''}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Preset Biomes Quick Dropdown */}
      <div className="hidden xl:flex items-center space-x-2 shrink-0">
        <div className="relative">
          <select
            value={selectedPreset?.id || ''}
            onChange={(e) => {
              const found = presets.find(p => p.id === e.target.value);
              if (found) {
                setSearchQuery('');
                onSelectPreset(found);
              }
            }}
            className="appearance-none bg-forest-50/80 hover:bg-forest-100/90 text-forest-900 text-xs font-semibold py-2 pl-7 pr-7 rounded-xl border border-forest-300 focus:outline-none focus:ring-2 focus:ring-forest-leaf cursor-pointer shadow-sm transition-all max-w-[180px] truncate"
          >
            <option value="" disabled>Select Preset Biome...</option>
            {presets.map(p => (
              <option key={p.id} value={p.id}>
                📍 {p.name}
              </option>
            ))}
          </select>
          <Globe className="w-3.5 h-3.5 text-forest-600 absolute left-2.5 top-2.5 pointer-events-none" />
          <ChevronDown className="w-3.5 h-3.5 text-forest-600 absolute right-2 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Right Actions: 45+ Flora + ML + Draw ROI */}
      <div className="flex items-center space-x-2 shrink-0">
        
        {/* 45+ Species Catalog Button */}
        <button
          onClick={onOpenCatalog}
          className="flex items-center space-x-1.5 bg-forest-50 hover:bg-forest-100 text-forest-deep text-xs font-semibold px-2.5 py-2 rounded-xl border border-forest-200 transition-all shadow-sm"
          title="Browse 45+ Trees & Agricultural Crops Catalog"
        >
          <BookOpen className="w-3.5 h-3.5 text-forest-leaf" />
          <span className="hidden sm:inline">45+ Flora</span>
        </button>

        {/* ML Engine Diagnostics Hub */}
        <button
          onClick={onOpenMLDiagnostics}
          className="flex items-center space-x-1.5 bg-purple-50 hover:bg-purple-100 text-purple-950 text-xs font-semibold px-2.5 py-2 rounded-xl border border-purple-200 transition-all shadow-sm"
          title="Machine Learning Multi-Target Model Telemetry & Retraining"
        >
          <Cpu className="w-3.5 h-3.5 text-purple-700" />
          <span className="hidden sm:inline">ML Model</span>
          <span className="text-[9px] bg-purple-200 text-purple-900 font-extrabold px-1.5 py-0.2 rounded-full">
            88.5%
          </span>
        </button>

        {/* Export Report Button */}
        <button
          onClick={onOpenExport}
          disabled={!scanData}
          className="flex items-center space-x-1.5 bg-forest-pale hover:bg-forest-mint/40 text-forest-deep text-xs font-semibold px-2.5 py-2 rounded-xl border border-forest-mint transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          title="Export complete 4-Pillar Afforestation & Species Dossier"
        >
          <Download className="w-3.5 h-3.5 text-forest-medium" />
          <span className="hidden md:inline">Export</span>
        </button>

        {/* Draw Custom ROI Tool */}
        <button
          onClick={onResetDraw}
          className="flex items-center space-x-1.5 bg-gradient-to-r from-forest-deep to-forest-medium hover:from-forest-medium hover:to-forest-pine text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-organic hover:shadow-organic-lg transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-forest-mint" />
          <span>Draw ROI</span>
        </button>
      </div>
    </header>
  );
}

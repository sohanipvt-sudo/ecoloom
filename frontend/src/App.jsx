import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MapViewer from './components/MapViewer';
import PlotInspectorModal from './components/PlotInspectorModal';
import ExportReportModal from './components/ExportReportModal';
import SpeciesCatalogModal from './components/SpeciesCatalogModal';
import MLDiagnosticsModal from './components/MLDiagnosticsModal';
import SpeciesCatalogPage from './pages/SpeciesCatalog';
import { fetchHealth, fetchPresets, runComprehensiveScan, fetchSpeciesCatalog } from './api/client';
import { Routes, Route, useNavigate } from 'react-router-dom';
import WardDetails from './pages/WardDetails';

// Initial Preset Biomes Fallback
const DEFAULT_PRESETS = [
  {
    id: "aravalli-corridor",
    name: "Aravalli Degraded Mining Ridge",
    region: "Haryana / Rajasthan, India",
    center: [28.3845, 77.0120],
    zoom: 13,
    description: "Severely degraded semi-arid rocky ridge with historic illegal mining scars, depleted groundwater, and severe seasonal dust pollution (high PM2.5/PM10).",
    default_env: {
      climate_zone: "Semi-Arid Subtropical",
      water_type: "Groundwater Deficit / Low Soil Moisture",
      land_type: "Rocky Wasteland / Steep Ridge",
      ambient_aqi: 185
    },
    default_polygon: [
      [28.3750, 77.0000],
      [28.3950, 77.0020],
      [28.3980, 77.0250],
      [28.3760, 77.0220],
      [28.3750, 77.0000]
    ]
  },
  {
    id: "sahel-green-wall",
    name: "Sahel Great Green Wall Frontier",
    region: "Matam Region, Senegal",
    center: [15.6550, -13.2550],
    zoom: 12,
    description: "Arid transition zone at the desertification front of the Sahara. Low organic soil, high wind erosion, severe drought vulnerability.",
    default_env: {
      climate_zone: "Arid / Desert",
      water_type: "Groundwater Deficit / Low Soil Moisture",
      land_type: "Sandy Dunes / Desert Soil",
      ambient_aqi: 85
    },
    default_polygon: [
      [15.6400, -13.2750],
      [15.6700, -13.2700],
      [15.6720, -13.2350],
      [15.6380, -13.2400],
      [15.6400, -13.2750]
    ]
  },
  {
    id: "western-ghats-buffer",
    name: "Western Ghats Degraded Escarpment",
    region: "Chikkamagaluru, Karnataka, India",
    center: [13.3150, 75.7750],
    zoom: 13,
    description: "Tropical montane rainforest buffer zone with steep slopes, moderate soil erosion due to deforestation, high biodiversity restoration value.",
    default_env: {
      climate_zone: "Tropical Wet",
      water_type: "Freshwater River / Canal",
      land_type: "Rocky Wasteland / Steep Ridge",
      ambient_aqi: 42
    },
    default_polygon: [
      [13.3050, 75.7600],
      [13.3280, 75.7620],
      [13.3250, 75.7900],
      [13.3020, 75.7880],
      [13.3050, 75.7600]
    ]
  }
];

export default function App() {
  const [presets, setPresets] = useState(DEFAULT_PRESETS);
  const [selectedPreset, setSelectedPreset] = useState(DEFAULT_PRESETS[0]);
  const [scanData, setScanData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [speciesCatalog, setSpeciesCatalog] = useState([]);

  // 4-Pillar Environmental Matrix State
  const [envParams, setEnvParams] = useState({
    climate_zone: "Semi-Arid Subtropical",
    water_type: "Groundwater Deficit / Low Soil Moisture",
    land_type: "Rocky Wasteland / Steep Ridge",
    ambient_aqi: 185
  });

  // UI Modals and Selection State
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [showPlotInspector, setShowPlotInspector] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSpeciesCatalog, setShowSpeciesCatalog] = useState(false);
  const [showMLDiagnostics, setShowMLDiagnostics] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [currentPolygon, setCurrentPolygon] = useState(DEFAULT_PRESETS[0].default_polygon);

  const navigate = useNavigate();

  // Initialize and check health
  useEffect(() => {
    fetchHealth().then((res) => {
      setBackendOnline(res?.status === 'online' || res?.status === 'healthy');
    });

    fetchPresets().then((serverPresets) => {
      if (serverPresets && serverPresets.length > 0) {
        setPresets(serverPresets);
        setSelectedPreset(serverPresets[0]);
        if (serverPresets[0].default_env) {
          setEnvParams(serverPresets[0].default_env);
        }
      }
    });

    fetchSpeciesCatalog().then((data) => {
      if (data && data.length > 0) {
        setSpeciesCatalog(data);
      }
    });
  }, []);

  const performScan = useCallback(async (polygon, presetId = null, envs = envParams) => {
    setIsScanning(true);
    try {
      const result = await runComprehensiveScan(polygon, presetId, 0.35, envs);
      setScanData(result);

      // Default select the first candidate parcel
      const firstParcel = result?.candidate_parcels_geojson?.features?.[0] ||
        result?.land_allocation?.candidate_parcels_geojson?.features?.[0];
      if (firstParcel) {
        setSelectedParcel(firstParcel);
      }
    } catch (err) {
      console.error('Scan execution error:', err);
    } finally {
      setIsScanning(false);
    }
  }, [envParams]);

  // Run comprehensive scan whenever preset changes
  useEffect(() => {
    if (!selectedPreset) return;
    const defaultEnv = selectedPreset.baseline_env || selectedPreset.default_env || {
      climate_zone: "Semi-Arid Subtropical",
      water_type: "Groundwater Deficit / Low Soil Moisture",
      land_type: "Rocky Wasteland / Steep Ridge",
      ambient_aqi: 165
    };
    setEnvParams(defaultEnv);
    setCurrentPolygon(selectedPreset.default_polygon);
    performScan(selectedPreset.default_polygon, selectedPreset.id, defaultEnv);
  }, [selectedPreset]);

  // =========================================================================
  // Upgraded: onPolygonCreated Handler for Custom Drawn Polygons
  // =========================================================================
  const handlePolygonCreated = async (polygon) => {
    setIsDrawingMode(false);
    setSelectedPreset(null);
    setCurrentPolygon(polygon);
    setIsScanning(true);

    try {
      // 1. Direct API Request to the Custom Polygon Scanner
      const response = await fetch("http://127.0.0.1:8000/api/scan-polygon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          polygon_coords: polygon,
          custom_buffer_ratio: 0.35
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const result = await response.json();
      setScanData(result);

      // 2. Sync inferred environment baseline with application state
      if (result.environmental_baseline) {
        setEnvParams((prev) => ({
          ...prev,
          ambient_aqi: result.environmental_baseline.aqi || prev.ambient_aqi,
          land_type: result.environmental_baseline.land_type || prev.land_type
        }));
      }

      // 3. Set primary candidate parcel
      const firstCandidate = result?.land_allocation?.plantable_zones?.features?.[0] ||
        result?.plantable_zones?.features?.[0] ||
        result?.candidate_parcels_geojson?.features?.[0];
      if (firstCandidate) {
        setSelectedParcel(firstCandidate);
      }

      // 4. Trigger celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

    } catch (err) {
      console.warn("Custom polygon direct scan failed, falling back to standard scan:", err);
      // Fallback to client standard scanner
      performScan(polygon, null, envParams);
    } finally {
      setIsScanning(false);
    }
  };

  // Handle custom location geocoded from search bar
  const handleSelectCustomLocation = (loc) => {
    const lat = loc.lat;
    const lon = loc.lon;
    const delta = 0.015;
    const customPoly = [
      [lat - delta, lon - delta],
      [lat + delta, lon - delta],
      [lat + delta, lon + delta],
      [lat - delta, lon + delta],
      [lat - delta, lon - delta]
    ];

    const inferred = loc.inferred_env || {
      climate_zone: Math.abs(lat) < 15 ? 'Tropical Wet' : (Math.abs(lat) < 32 ? 'Semi-Arid Subtropical' : 'Montane / Temperate'),
      water_type: 'Groundwater Deficit / Low Soil Moisture',
      land_type: 'Degraded Agricultural Fallow / Loam',
      ambient_aqi: 145
    };

    setSelectedPreset({
      id: `custom-${Date.now()}`,
      name: loc.display_name?.split(',')[0] || 'Custom Region',
      region: loc.display_name || 'Geocoded Coordinates',
      center: [lat, lon],
      zoom: 14,
      description: `Custom scan at (${lat.toFixed(4)}, ${lon.toFixed(4)})`,
      default_env: inferred,
      default_polygon: customPoly
    });

    setEnvParams(inferred);
    setCurrentPolygon(customPoly);
    performScan(customPoly, null, inferred);
  };

  const handleSelectParcel = (parcel) => {
    setSelectedParcel(parcel);
    setShowPlotInspector(true);
  };

  const handleUpdateEnvParam = (key, value) => {
    const updated = { ...envParams, [key]: value };
    setEnvParams(updated);
    if (currentPolygon) {
      performScan(currentPolygon, selectedPreset?.id, updated);
    }
  };

  const handleResetEnvParams = () => {
    if (selectedPreset?.default_env) {
      setEnvParams(selectedPreset.default_env);
      if (currentPolygon) {
        performScan(currentPolygon, selectedPreset.id, selectedPreset.default_env);
      }
    }
  };

  const handleRetrainSuccess = () => {
    if (currentPolygon) {
      performScan(currentPolygon, selectedPreset?.id, envParams);
    }
  };

  const Layout = () => (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-900 font-sans select-none">
      <Navbar
        presets={presets}
        selectedPreset={selectedPreset}
        onSelectPreset={(p) => {
          setSelectedPreset(p);
          setIsDrawingMode(false);
        }}
        onSelectCustomLocation={handleSelectCustomLocation}
        scanData={scanData}
        onOpenExport={() => setShowExportModal(true)}
        onOpenCatalog={() => setShowSpeciesCatalog(true)}
        onOpenMLDiagnostics={() => setShowMLDiagnostics(true)}
        onResetDraw={() => setIsDrawingMode(true)}
        isScanning={isScanning}
        backendOnline={backendOnline}
      />

      <main className="flex-1 flex overflow-hidden relative">
        <Sidebar
          scanData={scanData}
          selectedPreset={selectedPreset}
          onSelectParcel={handleSelectParcel}
          selectedParcel={selectedParcel}
          isScanning={isScanning}
          onTriggerScan={() => performScan(currentPolygon, selectedPreset?.id, envParams)}
          onOpenSpeciesModal={() => {
            if (selectedParcel) {
              setShowPlotInspector(true);
            } else {
              const firstP = scanData?.land_allocation?.plantable_zones?.features?.[0] ||
                scanData?.plantable_zones?.features?.[0] ||
                scanData?.candidate_parcels_geojson?.features?.[0];
              if (firstP) setSelectedParcel(firstP);
              setShowPlotInspector(true);
            }
          }}
          onOpenCatalog={() => setShowSpeciesCatalog(true)}
          onOpenMLDiagnostics={() => setShowMLDiagnostics(true)}
          envParams={envParams}
          onUpdateEnvParam={handleUpdateEnvParam}
          onResetEnvParams={handleResetEnvParams}
        />

        <MapViewer
          scanData={scanData}
          currentPolygon={currentPolygon}
          selectedPreset={selectedPreset}
          selectedParcel={selectedParcel}
          onSelectParcel={handleSelectParcel}
          onPolygonCreated={handlePolygonCreated}
          isDrawingMode={isDrawingMode}
          setIsDrawingMode={setIsDrawingMode}
        />
      </main>

      {showPlotInspector && selectedParcel && (
        <PlotInspectorModal
          parcel={selectedParcel}
          onClose={() => setShowPlotInspector(false)}
        />
      )}

      {showSpeciesCatalog && (
        <SpeciesCatalogModal
          catalog={speciesCatalog.length > 0 ? speciesCatalog : undefined}
          onClose={() => setShowSpeciesCatalog(false)}
        />
      )}

      {showMLDiagnostics && (
        <MLDiagnosticsModal
          onClose={() => setShowMLDiagnostics(false)}
          onRetrainSuccess={handleRetrainSuccess}
        />
      )}

      {showExportModal && scanData && (
        <ExportReportModal
          scanData={scanData}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<Layout />} />
      <Route path="/ward/:id" element={<WardDetails />} />
      <Route path="/catalog" element={<SpeciesCatalogPage />} />
    </Routes>
  );
}
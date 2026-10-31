import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Layers,
  Eye,
  EyeOff,
  Sliders,
  Crosshair,
  CheckCircle,
  XCircle,
  Sprout
} from 'lucide-react';

// Tile layer URL constants
const TILE_SATELLITE = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const TILE_TOPO_LIGHT = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

export default function MapViewer({
  scanData,
  currentPolygon,
  selectedPreset,
  selectedParcel,
  onSelectParcel,
  onPolygonCreated,
  isDrawingMode,
  setIsDrawingMode
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  // Layer visibility state
  const [showSatellite, setShowSatellite] = useState(true);
  const [showNdviOverlay, setShowNdviOverlay] = useState(true);
  const [showExclusions, setShowExclusions] = useState(true);
  const [showParcels, setShowParcels] = useState(true);
  const [ndviOpacity, setNdviOpacity] = useState(0.85);

  // Dynamic layer references
  const tileLayerRef = useRef(null);
  const ndviOverlayRef = useRef(null);
  const roiPolygonRef = useRef(null);
  const candidateLayerGroupRef = useRef(null);
  const excludedLayerGroupRef = useRef(null);
  const drawingLayerGroupRef = useRef(null);

  // Coordinates & Draw Points State
  const [cursorCoords, setCursorCoords] = useState({ lat: 22.5726, lng: 88.3639, zoom: 13 });
  const [drawPoints, setDrawPoints] = useState([]);

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initialCenter = selectedPreset?.center || [22.5726, 88.3639];
    const initialZoom = selectedPreset?.zoom || 13;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: false
    });

    L.control.zoom({ position: 'topleft' }).addTo(map);

    tileLayerRef.current = L.tileLayer(TILE_SATELLITE, {
      maxZoom: 19,
      attribution: 'Esri, Maxar, Earthstar Geographics'
    }).addTo(map);

    candidateLayerGroupRef.current = L.layerGroup().addTo(map);
    excludedLayerGroupRef.current = L.layerGroup().addTo(map);
    drawingLayerGroupRef.current = L.layerGroup().addTo(map);

    map.on('mousemove', (e) => {
      setCursorCoords({
        lat: Number(e.latlng.lat.toFixed(5)),
        lng: Number(e.latlng.lng.toFixed(5)),
        zoom: map.getZoom()
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 2. Base Tile Switcher
  useEffect(() => {
    if (!mapRef.current) return;
    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }
    const tileUrl = showSatellite ? TILE_SATELLITE : TILE_TOPO_LIGHT;
    tileLayerRef.current = L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(mapRef.current);
  }, [showSatellite]);

  // 3. Render Scanned Polygon Boundary, NDVI Colormap, Plantable & Non-Plantable Zones
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // A. Render Scanned ROI Boundary Polygon
    if (roiPolygonRef.current) {
      map.removeLayer(roiPolygonRef.current);
      roiPolygonRef.current = null;
    }

    const rawBoundary = currentPolygon ||
      scanData?.polygon_coords ||
      scanData?.roi_analysis?.polygon_coords ||
      scanData?.polygon ||
      selectedPreset?.default_polygon;

    if (rawBoundary && rawBoundary.length >= 3) {
      // Normalize to [lat, lng] array
      const leafCoords = rawBoundary.map(pt => {
        if (Array.isArray(pt)) {
          if (Math.abs(pt[0]) > 90 && Math.abs(pt[1]) <= 90) {
            return [pt[1], pt[0]];
          }
          return [pt[0], pt[1]];
        }
        return pt;
      });

      roiPolygonRef.current = L.polygon(leafCoords, {
        color: '#10b981',
        weight: 3,
        dashArray: '8, 6',
        fillColor: '#10b981',
        fillOpacity: 0.08,
        className: 'scanned-roi-boundary'
      }).addTo(map);

      roiPolygonRef.current.bindTooltip(`
        <div class="px-2 py-1 text-xs font-bold text-emerald-950">
          📍 Scanned Region Boundary
        </div>
      `, { sticky: true });

      map.fitBounds(roiPolygonRef.current.getBounds(), { padding: [40, 40] });
    }

    // B. Render Multi-Spectral NDVI Colormap Overlay
    if (ndviOverlayRef.current) {
      map.removeLayer(ndviOverlayRef.current);
      ndviOverlayRef.current = null;
    }

    const overlayUrl = scanData?.roi_analysis?.overlay_image_url || scanData?.overlay_image_url;
    let overlayBounds = scanData?.roi_analysis?.bounds || scanData?.bounds;
    if (!overlayBounds && roiPolygonRef.current) {
      const b = roiPolygonRef.current.getBounds();
      overlayBounds = [[b.getSouth(), b.getWest()], [b.getNorth(), b.getEast()]];
    }

    if (overlayUrl && overlayBounds && showNdviOverlay) {
      ndviOverlayRef.current = L.imageOverlay(overlayUrl, overlayBounds, {
        opacity: ndviOpacity,
        interactive: false,
        zIndex: 250
      }).addTo(map);
    }

    // C. Render Non‑Plantable (Excluded) Zones
    if (excludedLayerGroupRef.current) {
      excludedLayerGroupRef.current.clearLayers();
      const nonPlantableGeoJson = scanData?.land_allocation?.non_plantable_zones ||
        scanData?.non_plantable_zones ||
        scanData?.land_allocation?.exclusion_mask_geojson ||
        scanData?.exclusion_mask_geojson;

      if (nonPlantableGeoJson && nonPlantableGeoJson.features && nonPlantableGeoJson.features.length > 0 && showExclusions) {
        L.geoJSON(nonPlantableGeoJson, {
          style: () => ({
            color: '#d90429',
            weight: 2.5,
            dashArray: '6, 5',
            fillColor: '#e63946',
            fillOpacity: 0.55,
            className: 'non-plantable-zone'
          }),
          onEachFeature: (feature, layer) => {
            const props = feature.properties || {};
            const reason = props.reason || 'Restricted / Non-arable terrain';
            const featureDet = props.detected_feature ? `<div class="mt-1 text-[11px] text-rose-800 font-semibold">Detected: ${props.detected_feature}</div>` : '';

            layer.bindTooltip(`
              <div class="p-2.5 max-w-[240px] text-slate-800 bg-white rounded-lg shadow-md border-l-4 border-rose-600">
                <div class="flex items-center justify-between mb-1 pb-1 border-b border-rose-100">
                  <strong class="text-xs text-rose-900 font-bold">🚫 Non-Plantable Zone</strong>
                  <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">${props.area_ha || 0} ha</span>
                </div>
                <div class="text-[11px] text-slate-700 font-medium">${props.name || 'Excluded Sector'}</div>
                <div class="mt-1 text-[10px] text-slate-500">${reason}</div>
                ${featureDet}
              </div>
            `, { sticky: true });
          }
        }).addTo(excludedLayerGroupRef.current);
      }
    }

    // D. Render Plantable (Cultivable) Zones with Crop / Tree Icons
    if (candidateLayerGroupRef.current) {
      candidateLayerGroupRef.current.clearLayers();
      const plantableGeoJson = scanData?.land_allocation?.plantable_zones ||
        scanData?.plantable_zones ||
        scanData?.land_allocation?.candidate_parcels_geojson ||
        scanData?.candidate_parcels_geojson;

      if (plantableGeoJson && plantableGeoJson.features && plantableGeoJson.features.length > 0 && showParcels) {
        L.geoJSON(plantableGeoJson, {
          style: (feature) => {
            const isSelected = selectedParcel?.properties?.id === feature.properties?.id;
            return {
              color: isSelected ? '#004d40' : '#00e676',
              weight: isSelected ? 4.5 : 3.5,
              fillColor: '#10b981',
              fillOpacity: isSelected ? 0.82 : 0.62,
              className: 'candidate-parcel-polygon'
            };
          },
          onEachFeature: (feature, layer) => {
            const props = feature.properties || {};
            const topSp = props.recommended_species?.[0] || {};
            const cropIcon = topSp.icon || props.icon || '🌿';
            const primaryCrop = props.ml_recommendation?.primary_species ||
              topSp.species ||
              topSp.common_name ||
              topSp.botanical_name ||
              'Azadirachta indica (Neem)';
            const confidence = props.ml_recommendation?.confidence_pct || topSp.ml_confidence_pct || 94.2;

            layer.on('click', () => {
              if (onSelectParcel) onSelectParcel(feature);
            });

            layer.bindTooltip(`
              <div class="p-2.5 max-w-[260px] text-slate-800 bg-white rounded-lg shadow-md border-l-4 border-emerald-600">
                <div class="flex items-center justify-between mb-1.5 border-b border-emerald-100 pb-1">
                  <strong class="text-xs text-emerald-950 font-bold">🌱 Plantable Zone</strong>
                  <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">${props.area_ha || 0} ha</span>
                </div>
                <div class="text-[11px] font-semibold text-emerald-900 mb-1">${props.name || 'Cultivable Sector'}</div>
                <div class="text-[11px] text-slate-600 space-y-0.5 mb-2">
                  <p><strong>Suitability Score:</strong> <span class="text-emerald-700 font-bold">${props.suitability_score || 92}%</span></p>
                  <p><strong>Soil pH:</strong> ${props.env_params?.soil_ph || 7.0} | <strong>AQI:</strong> ${props.env_params?.ambient_aqi || 110}</p>
                </div>
                <div class="bg-emerald-50/90 border border-emerald-200 p-2 rounded-lg">
                  <div class="flex items-center space-x-1.5 text-xs text-emerald-950 font-bold">
                    <span class="text-base">${cropIcon}</span>
                    <span class="truncate">${primaryCrop}</span>
                  </div>
                  <div class="text-[10px] text-emerald-700 font-medium mt-0.5">
                    ML Match Confidence: <strong>${confidence}%</strong>
                  </div>
                </div>
              </div>
            `, { sticky: true });
          }
        }).addTo(candidateLayerGroupRef.current);
      }
    }
  }, [scanData, currentPolygon, showNdviOverlay, ndviOpacity, showExclusions, showParcels, selectedParcel]);

  // 4. Custom Drawing Mode Interaction
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleMapClick = (e) => {
      if (!isDrawingMode) return;

      const newPoint = [Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6))];
      const updatedPoints = [...drawPoints, newPoint];
      setDrawPoints(updatedPoints);

      if (drawingLayerGroupRef.current) {
        drawingLayerGroupRef.current.clearLayers();

        // Draw vertex markers
        updatedPoints.forEach((pt) => {
          L.circleMarker(pt, {
            radius: 5,
            color: '#1b4332',
            fillColor: '#52b788',
            fillOpacity: 0.9,
            weight: 2
          }).addTo(drawingLayerGroupRef.current);
        });

        // Draw connecting outline
        if (updatedPoints.length > 1) {
          L.polyline(updatedPoints, {
            color: '#2d6a4f',
            weight: 3,
            dashArray: '5, 5'
          }).addTo(drawingLayerGroupRef.current);
        }
      }
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [isDrawingMode, drawPoints]);

  const finishDrawing = () => {
    if (drawPoints.length >= 3) {
      const closed = [...drawPoints, drawPoints[0]];
      if (drawingLayerGroupRef.current) drawingLayerGroupRef.current.clearLayers();
      setDrawPoints([]);
      setIsDrawingMode(false);
      onPolygonCreated(closed);
    }
  };

  const cancelDrawing = () => {
    if (drawingLayerGroupRef.current) drawingLayerGroupRef.current.clearLayers();
    setDrawPoints([]);
    setIsDrawingMode(false);
  };

  return (
    <div className="relative w-full h-full flex-1 bg-slate-200 overflow-hidden select-none">

      {/* Leaflet Map DOM Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Layer Control HUD (Top-Right) */}
      <div className="absolute top-4 right-4 z-[400] bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-slate-200 shadow-lg w-64 space-y-2.5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
            <Layers className="w-4 h-4 text-emerald-700" />
            <span>GIS Layer Control</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Live</span>
        </div>

        <div className="space-y-2 text-xs">
          {/* Base Tile Toggle */}
          <button
            onClick={() => setShowSatellite(!showSatellite)}
            className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition-all text-slate-700"
          >
            <span className="flex items-center space-x-1.5">
              <span>🛰️</span>
              <span className="font-medium">Satellite View</span>
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${showSatellite ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
              {showSatellite ? 'Satellite' : 'Topo'}
            </span>
          </button>

          {/* Multi-Spectral NDVI Colormap Toggle */}
          <div className="p-1.5 rounded-lg bg-emerald-50/50 border border-emerald-100 space-y-1.5">
            <button
              onClick={() => setShowNdviOverlay(!showNdviOverlay)}
              className="w-full flex items-center justify-between transition-all text-slate-700"
            >
              <span className="flex items-center space-x-1.5">
                <span>🎨</span>
                <span className="font-medium text-emerald-950 font-bold">NDVI Colormap</span>
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${showNdviOverlay ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {showNdviOverlay ? 'Visible' : 'Hidden'}
              </span>
            </button>

            {showNdviOverlay && (
              <div className="flex items-center space-x-2 pt-1 border-t border-emerald-200/50">
                <span className="text-[10px] text-slate-500 font-medium">Opacity</span>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={ndviOpacity}
                  onChange={(e) => setNdviOpacity(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                />
                <span className="text-[10px] font-mono font-bold text-emerald-900">{Math.round(ndviOpacity * 100)}%</span>
              </div>
            )}
          </div>

          {/* Excluded Land Toggle */}
          <button
            onClick={() => setShowExclusions(!showExclusions)}
            className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition-all text-slate-700"
          >
            <span className="flex items-center space-x-1.5">
              <span>🚫</span>
              <span className="font-medium">Excluded Zones</span>
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${showExclusions ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-400'}`}>
              {showExclusions ? 'Active' : 'Hidden'}
            </span>
          </button>

          {/* Suitable Planting Zones Toggle */}
          <button
            onClick={() => setShowParcels(!showParcels)}
            className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition-all text-slate-700"
          >
            <span className="flex items-center space-x-1.5">
              <Sprout className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-medium">Candidate Parcels</span>
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${showParcels ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
              {showParcels ? 'Active' : 'Hidden'}
            </span>
          </button>
        </div>
      </div>

      {/* Multi-Spectral NDVI Palette Legend (Bottom-Left) */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-slate-200 shadow-lg text-xs space-y-2 max-w-[220px]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
          <span className="font-extrabold text-slate-800 text-[11px] flex items-center gap-1">
            <span>🛰️</span> NDVI Spectral Legend
          </span>
          <span className="text-[9px] font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-600">Sentinel-2</span>
        </div>

        <div className="space-y-1.5 text-[10px] font-medium">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-[#1b4332] shrink-0 border border-slate-300" />
              <span className="text-slate-700">Dense Canopy</span>
            </div>
            <span className="font-mono text-slate-500">&gt; 0.65</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-[#52b788] shrink-0 border border-slate-300" />
              <span className="text-slate-700">Moderate Forest</span>
            </div>
            <span className="font-mono text-slate-500">0.45 - 0.65</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-[#fcbf49] shrink-0 border border-slate-300" />
              <span className="text-slate-700">Sparse Scrub</span>
            </div>
            <span className="font-mono text-slate-500">0.20 - 0.45</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-[#d90429] shrink-0 border border-slate-300" />
              <span className="text-slate-700">Barren / Degraded</span>
            </div>
            <span className="font-mono text-slate-500">0.00 - 0.20</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-[#1e6091] shrink-0 border border-slate-300" />
              <span className="text-slate-700">Water Body</span>
            </div>
            <span className="font-mono text-slate-500">&lt; 0.00</span>
          </div>
        </div>
      </div>

      {/* Interactive Drawing Toolbar (Top-Center) */}
      {isDrawingMode ? (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[400] bg-white/95 backdrop-blur-md rounded-2xl p-3 border-2 border-emerald-600 shadow-xl flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <div>
              <h4 className="text-xs font-bold text-slate-800">Drawing Custom Polygon</h4>
              <p className="text-[10px] text-slate-500">
                {drawPoints.length} points placed. Click map to add vertices.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={finishDrawing}
              disabled={drawPoints.length < 3}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm disabled:opacity-40 flex items-center space-x-1"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Scan Polygon</span>
            </button>
            <button
              onClick={cancelDrawing}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center space-x-1"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="absolute top-4 left-14 z-[400]">
          <button
            onClick={() => {
              setIsDrawingMode(true);
              setDrawPoints([]);
            }}
            className="flex items-center space-x-1.5 bg-white/95 hover:bg-white text-emerald-950 text-xs font-bold px-3 py-2 rounded-xl shadow-md border border-slate-200 backdrop-blur-md transition-all hover:scale-105"
            title="Click to draw a custom polygon anywhere on the map"
          >
            <Crosshair className="w-4 h-4 text-emerald-600" />
            <span>Draw Custom Polygon</span>
          </button>
        </div>
      )}

      {/* Live Telemetry Bar (Bottom-Right) */}
      <div className="absolute bottom-4 right-4 z-[400] bg-white/90 backdrop-blur-md rounded-2xl px-3.5 py-2 border border-slate-200 shadow-md text-[10px] font-mono text-slate-600 flex items-center space-x-4">
        <div>
          <span className="text-slate-400 font-bold mr-1">LAT:</span>
          <span className="text-slate-800 font-semibold">{cursorCoords.lat}°</span>
        </div>
        <div>
          <span className="text-slate-400 font-bold mr-1">LNG:</span>
          <span className="text-slate-800 font-semibold">{cursorCoords.lng}°</span>
        </div>
        <div>
          <span className="text-slate-400 font-bold mr-1">ZOOM:</span>
          <span className="text-slate-800 font-semibold">{cursorCoords.zoom}x</span>
        </div>
      </div>

    </div>
  );
}
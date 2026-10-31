"""
EcoLoom Preset Biomes & Real-World Deforestation Hotspots
Includes Global Coordinate Environmental Inference Engine for arbitrary location selection.
"""
from typing import Dict, Any, List

PRESET_BIOMES = [
    {
        "id": "aravalli-corridor",
        "name": "Aravalli Degraded Mining Ridge",
        "region": "Haryana / Rajasthan, India",
        "center": [28.3845, 77.0120],
        "zoom": 13,
        "description": "Severely degraded semi-arid rocky ridge with historic illegal mining scars, depleted groundwater, and severe seasonal dust pollution (high PM2.5/PM10).",
        "baseline_env": {
            "slope_deg": 18.5,
            "slope_class": "Steep (>15°)",
            "land_type": "Rocky Wasteland / Steep Ridge",
            "soil_texture": "Sandy Loam & Rocky Quartzite",
            "soil_ph": 7.6,
            "soil_organic_carbon": 0.45,
            "ambient_aqi": 185,
            "aqi_breakdown": {"pm25": 85, "pm10": 160, "co": 1.4, "so2": 24},
            "climate_zone": "Semi-Arid Subtropical",
            "water_type": "Groundwater Deficit / Low Soil Moisture",
            "annual_rainfall_mm": 580,
            "nearest_water_m": 820,
            "water_quality": {"ph": 7.8, "status": "Alkaline / Low Dissolved Oxygen", "salinity_ppt": 0.6}
        },
        "default_polygon": [
            [28.3750, 77.0000],
            [28.3950, 77.0020],
            [28.3980, 77.0250],
            [28.3760, 77.0220],
            [28.3750, 77.0000]
        ]
    },
    {
        "id": "sahel-green-wall",
        "name": "Sahel Great Green Wall Frontier",
        "region": "Matam Region, Senegal",
        "center": [15.6550, -13.2550],
        "zoom": 12,
        "description": "Arid transition zone at the desertification front of the Sahara. Low organic soil, high wind erosion, severe drought vulnerability.",
        "baseline_env": {
            "slope_deg": 3.2,
            "slope_class": "Flat (<5°)",
            "land_type": "Sandy Dunes / Desert Soil",
            "soil_texture": "Sandy Arenosol",
            "soil_ph": 6.8,
            "soil_organic_carbon": 0.28,
            "ambient_aqi": 120,
            "aqi_breakdown": {"pm25": 42, "pm10": 130, "co": 0.6, "so2": 8},
            "climate_zone": "Arid / Desert",
            "water_type": "Groundwater Deficit / Low Soil Moisture",
            "annual_rainfall_mm": 380,
            "nearest_water_m": 1450,
            "water_quality": {"ph": 7.1, "status": "Ephemeral / Seasonal", "salinity_ppt": 0.9}
        },
        "default_polygon": [
            [15.6400, -13.2750],
            [15.6700, -13.2700],
            [15.6720, -13.2350],
            [15.6380, -13.2400],
            [15.6400, -13.2750]
        ]
    },
    {
        "id": "western-ghats",
        "name": "Western Ghats Degraded Escarpment",
        "region": "Maharashtra / Karnataka, India",
        "center": [15.8497, 74.5020],
        "zoom": 13,
        "description": "Tropical montane rainforest buffer damaged by historical monoculture timber clearing and heavy monsoon slope erosion.",
        "baseline_env": {
            "slope_deg": 22.4,
            "slope_class": "Steep (>15°)",
            "land_type": "Rocky Wasteland / Steep Ridge",
            "soil_texture": "Lateritic Clay Loam",
            "soil_ph": 5.9,
            "soil_organic_carbon": 1.25,
            "ambient_aqi": 45,
            "aqi_breakdown": {"pm25": 14, "pm10": 32, "co": 0.3, "so2": 4},
            "climate_zone": "Tropical Wet",
            "water_type": "Freshwater River / Canal",
            "annual_rainfall_mm": 2800,
            "nearest_water_m": 310,
            "water_quality": {"ph": 6.8, "status": "Pristine Mountain Stream", "salinity_ppt": 0.1}
        },
        "default_polygon": [
            [15.8350, 74.4850],
            [15.8650, 74.4900],
            [15.8620, 74.5200],
            [15.8340, 74.5150],
            [15.8350, 74.4850]
        ]
    },
    {
        "id": "california-scar",
        "name": "Sierra Nevada Post-Fire Scar",
        "region": "California, USA",
        "center": [39.7596, -121.6219],
        "zoom": 12,
        "description": "Severe post-wildfire burn scar in Mediterranean montane climate with hydrophobicity and accelerated topsoil loss.",
        "baseline_env": {
            "slope_deg": 16.8,
            "slope_class": "Steep (>15°)",
            "land_type": "Mining Spoil / Degraded Land",
            "soil_texture": "Sandy Loam with Ash Crust",
            "soil_ph": 6.5,
            "soil_organic_carbon": 0.55,
            "ambient_aqi": 65,
            "aqi_breakdown": {"pm25": 22, "pm10": 48, "co": 0.4, "so2": 5},
            "climate_zone": "Mediterranean / Dry Summer",
            "water_type": "Groundwater Deficit / Low Soil Moisture",
            "annual_rainfall_mm": 720,
            "nearest_water_m": 620,
            "water_quality": {"ph": 7.0, "status": "Turbid / High Ash Runoff", "salinity_ppt": 0.2}
        },
        "default_polygon": [
            [39.7400, -121.6450],
            [39.7800, -121.6400],
            [39.7820, -121.6000],
            [39.7380, -121.6050],
            [39.7400, -121.6450]
        ]
    },
    {
        "id": "borneo-peatland",
        "name": "Central Kalimantan Peatland",
        "region": "Borneo, Indonesia",
        "center": [-2.2150, 113.9213],
        "zoom": 12,
        "description": "Drainage-canal degraded tropical peat swamp with high recurring peat fire risk and extreme acid-sulfate soil conditions.",
        "baseline_env": {
            "slope_deg": 1.5,
            "slope_class": "Flat (<5°)",
            "land_type": "Peatland / Swamp Soil",
            "soil_texture": "Fibric Organic Peat",
            "soil_ph": 4.2,
            "soil_organic_carbon": 4.80,
            "ambient_aqi": 160,
            "aqi_breakdown": {"pm25": 92, "pm10": 145, "co": 2.1, "so2": 18},
            "climate_zone": "Tropical Wet",
            "water_type": "Brackish / Saline Marsh",
            "annual_rainfall_mm": 3100,
            "nearest_water_m": 180,
            "water_quality": {"ph": 4.5, "status": "Acid Blackwater Canal", "salinity_ppt": 0.4}
        },
        "default_polygon": [
            [-2.2300, 113.9000],
            [-2.2000, 113.9050],
            [-2.2020, 113.9400],
            [-2.2320, 113.9350],
            [-2.2300, 113.9000]
        ]
    }
]

def infer_environmental_profile(lat: float, lng: float, location_name: str = "") -> Dict[str, Any]:
    """
    Intelligently infers authoritative stated Climate Zone, Meteorological indicators, Water Type, Land Type, and AQI for any latitude/longitude on Earth.
    """
    abs_lat = abs(lat)
    
    # 1. Stated Climate Zone & Meteorological Telemetry Inference
    if abs_lat > 55.0:
        climate_zone = "Montane / Temperate"
        koppen_code = "Dfb / ET (Boreal / Polar Alpine)"
        rainfall = 650
        temp_c = 8.5
        humidity_pct = 68
        climate_summary = "Cold temperate montane biome with short growing season and winter frost."
    elif 15.0 <= abs_lat <= 32.0 and (-20.0 <= lng <= 75.0 or -115.0 <= lng <= -100.0 or 115.0 <= lng <= 145.0):
        # Arid / Desert belts (Sahara, Thar, Arabian, Australian Outbacks, Sonora)
        climate_zone = "Arid / Desert"
        koppen_code = "BWh (Hot Hyper-Arid Desert)"
        rainfall = 220
        temp_c = 32.0
        humidity_pct = 32
        climate_summary = "Hyper-arid desert regime with extreme daytime thermal stress and low annual precipitation."
    elif abs_lat <= 15.0:
        # Equatorial / Tropical
        climate_zone = "Tropical Wet"
        koppen_code = "Af / Am (Tropical Wet & Monsoon)"
        rainfall = 2400
        temp_c = 28.5
        humidity_pct = 82
        climate_summary = "Humid tropical rainforest/monsoon regime with high year-round precipitation and vegetative vigor."
    elif 30.0 <= abs_lat <= 45.0 and (-10.0 <= lng <= 40.0 or -125.0 <= lng <= -115.0 or lng >= 130.0):
        climate_zone = "Mediterranean / Dry Summer"
        koppen_code = "Csa / Csb (Mediterranean Dry-Summer)"
        rainfall = 720
        temp_c = 21.0
        humidity_pct = 58
        climate_summary = "Mild Mediterranean climate characterized by warm dry summers and moderate winter rain."
    elif 20.0 <= abs_lat <= 35.0:
        climate_zone = "Semi-Arid Subtropical"
        koppen_code = "BSh / Cwa (Hot Semi-Arid Subtropical)"
        rainfall = 620
        temp_c = 27.0
        humidity_pct = 54
        climate_summary = "Semi-arid subtropical regime with high solar radiation and monsoon-dependent precipitation."
    else:
        climate_zone = "Montane / Temperate"
        koppen_code = "Cfb (Oceanic / Highland Temperate)"
        rainfall = 1050
        temp_c = 16.5
        humidity_pct = 70
        climate_summary = "Moderate temperate regime with balanced moisture distribution across seasons."

    # 2. Water Type & Proximity Inference
    if abs_lat < 45.0 and (abs(lng) > 170.0 or (lng > 70 and lng < 90 and lat < 18) or (lng > -80 and lng < -60 and lat < 25)):
        water_type = "Brackish / Saline Marsh"
        nearest_water_m = 320
        water_status = "Coastal Estuary / Marine Brackish"
    elif climate_zone == "Arid / Desert":
        water_type = "Groundwater Deficit / Low Soil Moisture"
        nearest_water_m = 1250
        water_status = "Deep Aquifer Deficit"
    elif climate_zone == "Tropical Wet":
        water_type = "Freshwater River / Canal"
        nearest_water_m = 280
        water_status = "Perennial Freshwater Stream"
    else:
        water_type = "Groundwater Deficit / Low Soil Moisture"
        nearest_water_m = 650
        water_status = "Seasonal Stream / Municipal Runoff"

    # 3. Land Type / Soil Inference
    if climate_zone == "Arid / Desert":
        land_type = "Sandy Dunes / Desert Soil"
        soil_texture = "Fine Sand & Quartz Arenosol"
        soil_ph = 8.1
        slope_deg = 4.0
    elif abs_lat > 25.0 and (65.0 <= lng <= 100.0 or -125.0 <= lng <= -105.0 or 5.0 <= lng <= 20.0):
        land_type = "Rocky Wasteland / Steep Ridge"
        soil_texture = "Skeletal Rocky Loam"
        soil_ph = 7.4
        slope_deg = 19.5
    elif climate_zone == "Tropical Wet" and abs_lat < 8.0:
        land_type = "Peatland / Swamp Soil"
        soil_texture = "Hydric Clay & Peat"
        soil_ph = 5.2
        slope_deg = 2.5
    else:
        land_type = "Degraded Agricultural Fallow / Loam"
        soil_texture = "Silty Clay Loam"
        soil_ph = 6.9
        slope_deg = 6.5

    # 4. Ambient AQI Inference
    if (15.0 <= lat <= 35.0 and 65.0 <= lng <= 125.0):
        ambient_aqi = 195
        aqi_breakdown = {"pm25": 92, "pm10": 175, "co": 1.6, "so2": 26}
    elif climate_zone == "Arid / Desert":
        ambient_aqi = 135
        aqi_breakdown = {"pm25": 48, "pm10": 150, "co": 0.5, "so2": 10}
    elif abs_lat < 12.0:
        ambient_aqi = 55
        aqi_breakdown = {"pm25": 18, "pm10": 42, "co": 0.3, "so2": 4}
    else:
        ambient_aqi = 75
        aqi_breakdown = {"pm25": 24, "pm10": 58, "co": 0.4, "so2": 7}

    return {
        "climate_zone": climate_zone,
        "koppen_code": koppen_code,
        "temperature_c": temp_c,
        "humidity_pct": humidity_pct,
        "climate_summary": climate_summary,
        "water_type": water_type,
        "land_type": land_type,
        "ambient_aqi": ambient_aqi,
        "aqi_breakdown": aqi_breakdown,
        "slope_deg": slope_deg,
        "slope_class": "Steep (>15°)" if slope_deg > 15.0 else ("Moderate (5-15°)" if slope_deg > 5.0 else "Flat (<5°)"),
        "soil_texture": soil_texture,
        "soil_ph": soil_ph,
        "soil_organic_carbon": 0.65,
        "annual_rainfall_mm": rainfall,
        "nearest_water_m": nearest_water_m,
        "water_quality": {"ph": 7.2, "status": water_status, "salinity_ppt": 0.4}
    }

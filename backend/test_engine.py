"""
EcoLoom Verification & Test Suite
Tests 4-Pillar Matchmaking (Climate, Water Type, Land Type, AQI),
arbitrary coordinate environmental inference, satellite analysis,
N-P-K soil nutrient balancing, and crop yield forecasting.
"""
import sys
import io

# Set UTF-8 encoding for stdout
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')


from services.presets import PRESET_BIOMES, infer_environmental_profile
from services.satellite_engine import analyze_satellite_roi
from services.osm_masking import generate_exclusion_and_candidate_parcels
from services.recommendation_engine import (
    get_recommendations_for_parcel,
    score_species_4_pillars,
    predict_crop_advisory,
    SPECIES_CATALOG
)

def test_full_pipeline():
    print(">>> 1. Testing Presets & Coordinate Environmental Inference...")
    assert len(PRESET_BIOMES) >= 5, "Must have at least 5 preset biomes"
    
    # Test coordinate inference for global points
    cairo_env = infer_environmental_profile(30.0444, 31.2357, "Cairo, Egypt")
    print(f"Cairo Inference: Climate={cairo_env['climate_zone']}, Land={cairo_env['land_type']}, Water={cairo_env['water_type']}, AQI={cairo_env['ambient_aqi']}")
    assert cairo_env["climate_zone"] == "Arid / Desert"

    kolkata_env = infer_environmental_profile(22.5726, 88.3639, "Kolkata, India")
    print(f"Kolkata Inference: Climate={kolkata_env['climate_zone']}, Land={kolkata_env['land_type']}, AQI={kolkata_env['ambient_aqi']}")

    print("\n>>> 2. Testing Satellite Spectral & NDVI Engine...")
    preset = PRESET_BIOMES[0]
    roi_result = analyze_satellite_roi(preset["default_polygon"], preset_id=preset["id"])
    assert "afforestation_score" in roi_result
    assert "mean_ndvi" in roi_result
    assert "overlay_image_url" in roi_result
    print(f"Afforestation Score: {roi_result['afforestation_score']}% | Mean NDVI: {roi_result['mean_ndvi']}")

    print("\n>>> 3. Testing Spatial Exclusion & Candidate Parcel Generation...")
    land_result = generate_exclusion_and_candidate_parcels(preset["default_polygon"], preset_id=preset["id"])
    assert land_result["total_candidate_parcels"] > 0
    parcels = land_result["candidate_parcels_geojson"]["features"]
    print(f"Candidate Parcels Identified: {len(parcels)} (Total Area: {land_result['total_allocatable_ha']} ha)")

    print(f"\n>>> 4. Testing 4-Pillar Matchmaking with 45+ Species (Count: {len(SPECIES_CATALOG)})...")
    sample_parcel = parcels[0]["properties"]
    recs = get_recommendations_for_parcel(sample_parcel, top_k=5)
    assert len(recs) == 5
    for r in recs:
        print(f"  * [{r['category']}] {r['botanical_name']} ({r['common_name']}): Match {r['match_score']}% | Yield: {r.get('predicted_yield_t_ha', 'N/A')} t/ha | Fertilizer: {r.get('fertilizer_recommendation', 'Optimal')}")

    print("\n>>> 5. Testing Agronomic Crop & Agroforestry Advisor Engine...")
    crop_res = predict_crop_advisory(
        env=sample_parcel.get("env_params", {}),
        n_ppm=40,
        p_ppm=14,
        k_ppm=120,
        target_category="All",
        annual_rainfall_mm=600,
        avg_temp_c=27.5
    )
    assert "top_matches" in crop_res
    assert len(crop_res["top_matches"]) > 0
    print(f"  * Identified {len(crop_res['top_matches'])} suitable crops & companion systems.")
    for cm in crop_res["top_matches"][:3]:
        print(f"    - {cm['common_name']} ({cm['category']}): Score {cm['crop_score']}% | Yield: {cm['predicted_yield_t_ha']} t/ha | NPK Match: {cm['nutrient_match_score']}% | Companion: {cm.get('agroforestry_companions')}")

    print("\n[SUCCESS] All EcoLoom 4-Pillar, Agronomy & Crop Advisory services validated!")

if __name__ == "__main__":
    test_full_pipeline()

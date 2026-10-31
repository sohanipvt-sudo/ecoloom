import requests
import pandas as pd
import geopandas as gpd
import sys, pathlib

# Ensure services path is in sys.path
services_path = pathlib.Path(__file__).parent / "services"
sys.path.append(str(services_path))

from services.spatial_utils import point_admin_hierarchy

# Public GeoJSON source for Kolkata municipal wards
API_URL = "https://raw.githubusercontent.com/datameet/Municipal_Spatial_Data/master/Kolkata/kolkata.geojson"

def fetch_ward_data():
    """Fetch ward GeoJSON, extract state, ward number, centroid coordinates, with local offline cache fallback."""
    cache_path = pathlib.Path(__file__).parent / "models" / "kolkata_wards_cached.csv"
    try:
        print(f"Fetching ward GeoJSON from {API_URL}...")
        response = requests.get(API_URL, timeout=8)
        response.raise_for_status()
        geojson = response.json()

        gdf = gpd.GeoDataFrame.from_features(geojson["features"])

        col_map = {str(c).lower(): c for c in gdf.columns}
        if "ward" in col_map:
            gdf["ward_number"] = gdf[col_map["ward"]]
        elif "ward_no" in col_map:
            gdf["ward_number"] = gdf[col_map["ward_no"]]
        elif "name" in col_map:
            gdf["ward_number"] = gdf[col_map["name"]]
        else:
            gdf["ward_number"] = range(1, len(gdf) + 1)

        gdf["state"] = "West Bengal"

        centroids = gdf.geometry.centroid
        gdf["latitude"] = centroids.y
        gdf["longitude"] = centroids.x

        df = gdf[["state", "ward_number", "latitude", "longitude"]].copy()
        try:
            cache_path.parent.mkdir(parents=True, exist_ok=True)
            df.to_csv(cache_path, index=False)
        except Exception:
            pass
        print(f"Successfully processed {len(df)} wards.")
        return df
    except Exception as e:
        print(f"Ward GeoJSON fetch error: {e}. Falling back to cached data...")
        if cache_path.exists():
            df = pd.read_csv(cache_path)
            print(f"Loaded {len(df)} wards from local cache.")
            return df
        print("Using minimal default ward spatial centroid.")
        return pd.DataFrame([{"state": "West Bengal", "ward_number": "1", "latitude": 22.5726, "longitude": 88.3639}])

if __name__ == "__main__":
    data = fetch_ward_data()
    print(data.head())

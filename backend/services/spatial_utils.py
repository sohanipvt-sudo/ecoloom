import json
import requests
from shapely.geometry import Point

OVERPASS_URL = "https://overpass-api.de/api/interpreter"

def _overpass_query(lat: float, lon: float) -> dict:
    """Query Overpass for admin levels containing the point.
    Returns a dict with keys 'state', 'district', 'ward'."""
    # Overpass QL: fetch relations for admin levels 4 (state), 6 (district), 8 (ward)
    query = f"[out:json];\n(\n  relation[admin_level=4](around:0,{lat},{lon});\n  relation[admin_level=6](around:0,{lat},{lon});\n  relation[admin_level=8](around:0,{lat},{lon});\n);\nout tags;"
    response = requests.post(OVERPASS_URL, data={"data": query}, timeout=15)
    response.raise_for_status()
    data = response.json()
    result = {"state": None, "district": None, "ward": None}
    for element in data.get("elements", []):
        tags = element.get("tags", {})
        admin_level = tags.get("admin_level")
        name = tags.get("name")
        if admin_level == "4":
            result["state"] = name
        elif admin_level == "6":
            result["district"] = name
        elif admin_level == "8":
            result["ward"] = name
    return result

def reverse_geocode(lat: float, lon: float) -> dict:
    """Return administrative hierarchy for a lat/lon point using Overpass.
    If the query fails, returns empty strings for each level."""
    try:
        return _overpass_query(lat, lon)
    except Exception:
        return {"state": "", "district": "", "ward": ""}

def point_admin_hierarchy(point: Point) -> dict:
    """Convenient wrapper for Shapely Point objects.
    ``point.x`` is longitude, ``point.y`` is latitude."""
    return reverse_geocode(point.y, point.x)

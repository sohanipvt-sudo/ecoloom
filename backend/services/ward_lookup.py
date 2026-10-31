# Ward lookup utilities

"""Utilities for fetching ward data, training a model, and predicting ward numbers.

- `fetch_ward_data(state: str) -> List[Dict]`: Pull raw ward data from a configurable public API.
- `prepare_training_dataframe(records: List[Dict]) -> pandas.DataFrame`: Convert raw records to a DataFrame with columns `lat`, `lon`, `ward_id`.
- `train_ward_model(df: pandas.DataFrame, n_neighbors: int = 5) -> KNeighborsClassifier`: Train a K‑Nearest Neighbors classifier.
- `predict_ward(model, lat: float, lon: float) -> str`: Predict the ward identifier for a coordinate.
"""

import os
import requests
import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
from pathlib import Path

# Base API URL can be overridden via environment variable WARD_API_BASE
BASE_URL = os.getenv("WARD_API_BASE", "https://public-api.example.gov/wards")

def fetch_ward_data(state: str) -> list[dict]:
    """Fetch ward data for the given state.

    Expected JSON response format (list of objects):
        {
            "ward_id": "W123",
            "centroid": {"lat": 12.34, "lon": 56.78}
        }
    """
    params = {"state": state}
    response = requests.get(BASE_URL, params=params, timeout=10)
    response.raise_for_status()
    return response.json()

def prepare_training_dataframe(records: list[dict]) -> pd.DataFrame:
    rows = []
    for rec in records:
        centroid = rec.get("centroid", {})
        lat = centroid.get("lat")
        lon = centroid.get("lon")
        ward_id = rec.get("ward_id")
        if lat is None or lon is None or ward_id is None:
            continue
        rows.append({"lat": lat, "lon": lon, "ward_id": ward_id})
    return pd.DataFrame(rows)

def train_ward_model(df: pd.DataFrame, n_neighbors: int = 5) -> KNeighborsClassifier:
    X = df[["lat", "lon"]]
    y = df["ward_id"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = KNeighborsClassifier(n_neighbors=n_neighbors, weights="distance")
    model.fit(X_train, y_train)
    acc = accuracy_score(y_test, model.predict(X_test))
    print(f"[WardLookup] Validation accuracy: {acc:.2%}")
    return model

def predict_ward(model: KNeighborsClassifier, lat: float, lon: float) -> str:
    return model.predict([[lat, lon]])[0]

def save_model(model: KNeighborsClassifier, path: str):
    joblib.dump(model, path)

def load_model(path: str) -> KNeighborsClassifier:
    return joblib.load(path)

# Tasks: 27+ Tree Catalog & Machine Learning Model Training

- [x] 1. Backend ML Architecture & Species Expansion <!-- id: 1 -->
  - [x] Create `backend/services/ml_model.py` with `scikit-learn` Pipeline, Train/Test split, Random Forest multi-output regressor, cross-validation metrics, and model persistence. <!-- id: 2 -->
  - [x] Expand `SPECIES_CATALOG` in `backend/services/recommendation_engine.py` to 27+ rich botanical species. <!-- id: 3 -->
  - [x] Connect ML model prediction into `get_recommendations_for_parcel` and `score_species_4_pillars`. <!-- id: 4 -->
  - [x] Add ML model status and training endpoints in `backend/main.py`. <!-- id: 5 -->
  - [x] Train and serialize `ecoloom_ml_species_model.joblib`. <!-- id: 6 -->

- [x] 2. Frontend ML Telemetry & 27+ Species Catalog Sync <!-- id: 7 -->
  - [x] Update `frontend/src/api/client.js` with 27+ species catalog and ML status fetcher. <!-- id: 8 -->
  - [x] Update `Sidebar.jsx` with ML engine status badge (Random Forest Ensemble • R² Score). <!-- id: 9 -->
  - [x] Update `PlotInspectorModal.jsx` with ML confidence, feature importance breakdown, and new species details. <!-- id: 10 -->

- [x] 3. Verification & Testing <!-- id: 11 -->
  - [x] Run backend tests (`test_engine.py`) to verify ML predictions across all biomes. <!-- id: 12 -->
  - [x] Run `npm run build` in `frontend/`. <!-- id: 13 -->
  - [x] Use `browser_subagent` to test end-to-end user experience and capture screenshots. <!-- id: 14 -->
  - [x] Create walkthrough documentation. <!-- id: 15 -->


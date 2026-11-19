# Aura Space Real Estate & Historical Housing ML

A React 18 / Vite / Tailwind real-estate application with Supabase accounts, property listings, favorites, enquiries and seller/agent dashboards. A separate FastAPI service runs the existing 50/50 Ridge + tuned Gradient Boosting ensemble.

The estimator is a **historical Ames, Iowa demonstration using 2006–2010 sales**. It does not estimate contemporary market prices, other cities, other countries or rents. Prices are USD at the stored 2010 serving reference year.

## Project structure

```
.
├── src/                    React app (Vite + Tailwind)
│   ├── pages/              One folder per route (Home, Properties, Estimator, ...)
│   ├── components/         agent/ common/ model/ property/ search/ three/
│   ├── context/ hooks/     Auth + favorites state, shared hooks
│   ├── lib/                Supabase client, data API, estimator API client
│   ├── routes/ utils/ data/
├── backend/                FastAPI price-estimator service
│   ├── app.py              API routes
│   ├── train_model.py      Rebuilds the model from data/
│   ├── artifacts/          Saved model.joblib
│   ├── report/             Notebook metrics + figures served by the API
│   └── tests/
├── data/ames-housing/      Kaggle Ames training/test CSVs
├── notebooks/              Original modelling notebook
├── database/               Supabase SQL, run in numeric order (01, 02, 03)
├── docs/                   DESIGN, PRODUCT, IMPLEMENTATION notes
├── scripts/                In-memory demo integration check
└── .github/workflows/      CI (lint, build, backend tests)
```

## Run locally

From the project root, use two terminals:

```powershell
npm install
npm run dev
```

```powershell
python -m pip install -r backend/requirements-dev.txt
python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000
```

Open http://localhost:5173. The saved `backend/artifacts/model.joblib` is included; **retraining is not required**. Use the compatible scikit-learn version pinned in `backend/requirements.txt`. FastAPI's interactive API schema is at http://127.0.0.1:8000/docs.

If port 8000 is already in use, run the backend on 8001 and start Vite with:

```powershell
$env:API_PROXY_TARGET='http://127.0.0.1:8001'
npm run dev
```

Without Supabase settings, development uses labelled sample properties and simulated browser-local accounts. These are not real authentication, verified agents or real enquiries. Distinct demo emails receive separate local identities. Production demo accounts require explicit `VITE_ENABLE_DEMO=true`; otherwise authentication fails closed when Supabase is missing.

## Connect Supabase

1. Copy `.env.example` to `.env` and provide the project's public URL and anon/publishable key. Never put a service-role or private key in a `VITE_` variable.
2. For a fresh database, run `database/01_supabase_setup.sql` in its SQL editor. This includes **sample** properties and agents; replace seed data before presenting real listings.
3. For an older installation that predates dashboards, run `database/02_supabase_migration_dashboard.sql`.
4. In every installation, run `database/03_supabase_security_hardening.sql` after the applicable setup scripts. It limits editable profile/agent columns, protects roles and listing reassignment, validates enquiry ownership/recipients, and configures image uploads in user-owned folders.
5. Configure Auth Site URL and allowed redirects, including `/reset-password`. Enable Google/Facebook providers only if those social-login options will be used.

The hardening migration creates or configures the public `property-images` bucket with a 1 MB limit and JPEG/PNG/WebP/AVIF MIME restrictions. Public listing images are readable; uploads/deletes use the caller's UUID folder. Check for older permissive storage policies in an existing database, since permissive policies combine with OR. Roles selected during signup are self-service application roles, not proof of a professional license. Later role changes require an administrator.

No remote database migration was applied during the local implementation. Validate the migration in a staging Supabase project, including cross-account role updates, ownership reassignment, enquiry access and storage paths, before production use.

## Features and routes

- `/`: architectural photography, property search, selected listings, city discovery, agent directory preview and a historical AI project showcase.
- `/properties`: filters, removable active filters, sorting, pagination, grid/list views, skeletons and empty states.
- `/properties/:id`: supplied photographs with a keyboard-accessible native-dialog gallery, property tabs, listing contact, tour enquiry and similar homes. The lazy photo viewer is a projected-photo demonstration, not a verified 360-degree tour. Unprovided amenities and floor plans are not invented.
- `/estimator`: four-step workflow collecting all 18 supported inputs; review, real prediction, explicit MAE reference band, submitted-input snapshot, global tree importance and real backend what-if comparisons.
- `/model-report`: detailed case study plus a six-stage interactive pipeline, real live inference trace, selectable RMSE/MAE/log-R² model rankings, price-band error exploration, global importance inspection, all six original figures and limitations.
- `/agents`, `/agents/:id`, `/about`, `/contact`, `/favorites` and existing dashboard/auth routes remain available. `/reset-password` completes Supabase email recovery.

The platform never automatically runs the Ames estimator on a listing. A contextual link opens the separate historical demonstration.

## Model interpretation

The served model uses 18 visitor inputs and stored defaults/assumptions for other attributes, engineers features, and applies its saved encoding/scaling pipelines. Ridge and Gradient Boosting each contribute 50% of the log-price prediction; `expm1` converts the blend back to dollars. The model artifact has not been replaced or retrained.

The repository's stored notebook test metrics are R² **0.9049 on log prices**, MAE **$13,981**, and dollar RMSE **$21,673**. R² is not a prediction-accuracy percentage. The notebook's held-out results and figures are preserved; `train_model.py` fits the selected model on all 1,458 cleaned labelled rows for serving and does not recreate notebook split evaluation/tuning.

`estimate ± test MAE` is an **error reference**, not a calibrated confidence interval. Global impurity importance belongs to the Gradient Boosting component and does not explain individual predictions. What-if differences measure model sensitivity, not causal renovation value.

The compatible API routes are `/api/health`, `/api/meta`, `/api/predict`, `/api/report` and `/api/figures/*`. Predictions and metadata add USD currency, historical scope, reference year, an artifact SHA-256 version prefix, band method and interpretation. Existing estimate/low/high/typical_error fields remain compatible.

## Verification

```powershell
npm run build
npm run lint
python -m pytest backend/tests -q
node scripts/test-demo.mjs
```

The in-memory demo integration check exercises roles, distinct identities, listing creation/search/details, ownership rejection, favorites, enquiries and logout. It refuses to run against a configured Supabase project. See `docs/IMPLEMENTATION.md` for the implementation inventory, executed checks and verification limits.

## Deployment

Build the frontend with `npm run build`, serve `dist`, and route SPA paths to `index.html`. Deploy FastAPI separately with the included trusted model artifact and pinned ML dependency. Route same-origin `/api/*` to FastAPI, or set the public HTTPS `VITE_API_BASE_URL` at frontend build time. Vite's development proxy does not ship with the built site.

Set backend `CORS_ORIGINS` to comma-separated exact frontend HTTPS origins. Use TLS and edge-level abuse/rate controls for public inference and anonymous enquiry endpoints. CORS is a browser access rule, not authentication or abuse protection. Do not expose development servers publicly. No hosting deployment was performed.

Route pages and the expensive photo viewer are lazy-loaded. The Three.js vendor chunk remains large, but is requested by the optional photo viewer rather than the initial homepage. Fonts and photography require access to Google Fonts/Unsplash; substitute licensed self-hosted assets if offline operation is required.

## Interactive ML demonstration

Open `/model-report#interactive-lab`. The pipeline explorer explains the original notebook’s split, cleaning, encoding, feature engineering, tuning and log-scale ensemble. The live trace calls `POST /api/demonstrate` with the same validated `HouseInput` as the estimator and shows actual engineered values, saved preprocessing output dimensions, Ridge/boosting log and dollar outputs, and the final estimate. Tab state persists while comparing models and errors. Neither this endpoint nor the UI retrains the artifact or computes individual feature attribution.

The current workspace uses a gitignored `.env.development.local` override for the API at `http://127.0.0.1:8001`; start the backend on port 8001 for this preview. Remove or edit that local override when using a different development API. Production builds continue to use the normal build-time API configuration.

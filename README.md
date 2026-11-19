<div align="center">

<img src="docs/images/aura-space-banner.webp" alt="Aura Space – Premium Real Estate · Intelligent Valuation" width="100%" />

<br />

# Aura Space

**Premium real estate discovery with an intelligent, machine-learning price estimator.**

[![CI](https://github.com/vranasinghe/Real-state-project/actions/workflows/ci.yml/badge.svg)](https://github.com/vranasinghe/Real-state-project/actions/workflows/ci.yml)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth_&_DB-3ECF8E?logo=supabase&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-ML-F7931E?logo=scikitlearn&logoColor=white)

[Features](#-features) ·
[Tech stack](#-tech-stack) ·
[Getting started](#-getting-started) ·
[AI estimator](#-ai-price-estimator) ·
[Deployment](#-deployment) ·
[Documentation](#-documentation)

</div>

---

## 📖 Overview

**Aura Space** is a full-stack real-estate platform that pairs a polished property-discovery experience with an AI valuation tool.

- A **React + Vite + Tailwind** single-page app for browsing listings, saving favorites, contacting agents and managing listings from seller/agent dashboards.
- **Supabase** for authentication, the Postgres database, row-level security and image storage.
- A separate **FastAPI** service that serves a 50/50 **Ridge + tuned Gradient Boosting** ensemble to estimate a home's value.

> [!IMPORTANT]
> The estimator is a **historical demonstration trained on Ames, Iowa sales from 2006–2010**. It does not estimate contemporary market prices, other cities or countries, or rents. All prices are USD at a stored 2010 reference year.

## ✨ Features

| Area | Highlights |
| --- | --- |
| **Property discovery** | Search, filters with removable chips, sorting, pagination, grid/list views, skeleton loaders and empty states |
| **Property details** | Keyboard-accessible photo gallery, tabbed details, agent contact, tour enquiries and similar homes |
| **AI Price Estimator** | Four-step wizard with 18 inputs, real model prediction, error-reference band, input snapshot and what-if comparisons |
| **Model report** | Interactive six-stage pipeline, live inference trace, model rankings, price-band errors, feature importance and limitations |
| **Accounts & roles** | Email auth, password recovery, favorites, buyer / seller / agent dashboards and enquiry management |
| **Agents** | Agent directory and individual agent profiles with contact forms |
| **Security** | Row-level security, role and ownership protection, validated enquiries and user-scoped image uploads |

### Routes

| Route | Description |
| --- | --- |
| `/` | Hero search, selected listings, city discovery, agent preview, AI project showcase |
| `/properties` | Browse and filter all listings |
| `/properties/:id` | Listing details, gallery, enquiry and similar homes |
| `/estimator` | Four-step AI price estimator |
| `/model-report` | ML case study and interactive pipeline lab (`#interactive-lab`) |
| `/agents`, `/agents/:id` | Agent directory and profiles |
| `/about`, `/contact`, `/favorites` | Supporting pages |
| `/login`, `/register`, `/forgot-password`, `/reset-password` | Authentication flows |

## 🧰 Tech stack

| Layer | Technology |
| --- | --- |
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, React Router 6, Framer Motion, Lucide icons, Three.js / React Three Fiber |
| **Backend API** | FastAPI, Pydantic, scikit-learn, pandas, NumPy, joblib |
| **Database & auth** | Supabase (Postgres, Auth, Storage, RLS) |
| **Tooling** | ESLint, pytest, GitHub Actions CI |
| **Hosting** | Vercel (frontend), Render (estimator API) |

## 🗂 Project structure

```
.
├── frontend/                   React app (Vite + Tailwind)
│   ├── src/
│   │   ├── pages/              One folder per route (Home, Properties, Estimator, ...)
│   │   ├── components/         agent/ common/ model/ property/ search/ three/
│   │   ├── context/ hooks/     Auth + favorites state, shared hooks
│   │   ├── lib/                Supabase client, data API, estimator API client
│   │   └── routes/ utils/ data/
│   ├── scripts/                In-memory demo integration check
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
├── backend/                    FastAPI price-estimator service
│   ├── app.py                  API routes
│   ├── train_model.py          Rebuilds the model from ml/data
│   ├── artifacts/              Saved model.joblib
│   ├── report/                 Notebook metrics + figures served by the API
│   ├── tests/
│   └── .env.example
├── ml/                         Machine-learning assets
│   ├── data/ames-housing/      Kaggle Ames training/test CSVs
│   └── notebooks/              Original modelling notebook
├── database/                   Supabase SQL, run in numeric order (01, 02, 03)
├── docs/                       DESIGN, PRODUCT, IMPLEMENTATION notes, images
├── .github/workflows/          CI (lint, build, backend tests)
├── vercel.json                 Vercel build config + SPA rewrite
└── render.yaml                 Render Blueprint for the API
```

## 🚀 Getting started

### Prerequisites

- **Node.js** 20 and npm
- **Python** 3.14 (see `.python-version`)

### 1. Install and run

Use two terminals.

**Frontend** (from `frontend/`)

```powershell
cd frontend
npm install
npm run dev
```

**Backend** (from the project root)

```powershell
python -m pip install -r backend/requirements-dev.txt
python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000
```

Then open <http://localhost:5173>. Interactive API docs are at <http://127.0.0.1:8000/docs>.

The trained `backend/artifacts/model.joblib` is included, so **retraining is not required**. Use the scikit-learn version pinned in `backend/requirements.txt`.

<details>
<summary><b>Port 8000 already in use?</b></summary>

Run the backend on 8001 and point Vite's proxy at it:

```powershell
$env:API_PROXY_TARGET='http://127.0.0.1:8001'
npm run dev
```

</details>

### 2. Environment variables

Frontend variables go in `frontend/.env` (copy `frontend/.env.example`); the backend reads `CORS_ORIGINS` from its environment (see `backend/.env.example`):

| Variable | Scope | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Frontend | Public Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Frontend | Public anon / publishable key (**never** a service-role key) |
| `VITE_API_BASE_URL` | Frontend | Estimator API origin; empty uses same-origin `/api` |
| `VITE_ENABLE_DEMO` | Frontend | Set `true` to allow demo accounts in production |
| `CORS_ORIGINS` | Backend | Comma-separated exact frontend origins, no trailing slash |

Without Supabase settings, development falls back to clearly labelled sample properties and simulated browser-local accounts. These are **not** real authentication, verified agents or real enquiries. In production, authentication fails closed unless `VITE_ENABLE_DEMO=true`.

### 3. Connect Supabase

1. Create a Supabase project and add its URL and anon key to `frontend/.env`.
2. Run `database/01_supabase_setup.sql` in the SQL editor (includes **sample** properties and agents — replace before showing real listings).
3. For installations that predate dashboards, also run `database/02_supabase_migration_dashboard.sql`.
4. Run `database/03_supabase_security_hardening.sql` in **every** installation. It restricts editable columns, protects roles and listing ownership, validates enquiries and configures image uploads.
5. Set the Auth Site URL and allowed redirects (including `/reset-password`). Enable Google/Facebook providers only if you use social login.

> [!NOTE]
> Validate migrations in a staging Supabase project (role updates, ownership reassignment, enquiry access, storage paths) before applying them to production.

## 🤖 AI price estimator

The served model takes **18 visitor inputs**, fills the remaining attributes with stored training medians/modes, engineers features and applies the saved encoding/scaling pipelines. Ridge and Gradient Boosting each contribute 50% of the log-price prediction, and `expm1` converts the blend back to dollars.

### Held-out test metrics (from the original notebook)

| Metric | Value |
| --- | --- |
| R² (log price) | **0.9049** |
| MAE | **$13,981** |
| RMSE | **$21,673** |

### Reading the results correctly

- R² is **not** a prediction-accuracy percentage.
- `estimate ± test MAE` is an **error reference**, not a calibrated confidence interval.
- Feature importance is **global** Gradient Boosting impurity importance and does not explain individual predictions.
- What-if differences measure **model sensitivity**, not causal renovation value.
- The platform never automatically runs the Ames estimator on a listing; a contextual link opens the separate historical demo.

### API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Service health check |
| `GET` | `/api/meta` | Scope, model version, currency and transparency metadata |
| `POST` | `/api/predict` | Estimate a price from validated `HouseInput` |
| `POST` | `/api/demonstrate` | Real feature-engineering and ensemble inference trace |
| `GET` | `/api/report` | Notebook metrics and comparison tables |
| `GET` | `/api/figures/*` | Report figures |

`backend/train_model.py` fits the selected model on all 1,458 cleaned labelled rows for serving. It does not recreate the notebook's split evaluation or tuning.

## ✅ Verification

```powershell
cd frontend
npm run build
npm run lint
node scripts/test-demo.mjs
cd ..
python -m pytest backend/tests -q
```

The in-memory demo check exercises roles, distinct identities, listing creation/search/details, ownership rejection, favorites, enquiries and logout. It refuses to run against a configured Supabase project. The same lint, build and backend-test steps run in GitHub Actions on every push.

## ☁️ Deployment

| Component | Platform | Configuration |
| --- | --- | --- |
| Frontend | Vercel | Root `vercel.json` builds `frontend/` and adds the SPA rewrite (no dashboard Root Directory needed) |
| Estimator API | Render | `render.yaml` Blueprint, health check at `/api/health` |

1. Build the frontend with `npm run build` in `frontend/` and serve `frontend/dist`, routing SPA paths to `index.html`.
2. Deploy FastAPI separately with the included model artifact and pinned ML dependencies.
3. Route same-origin `/api/*` to FastAPI, **or** set a public HTTPS `VITE_API_BASE_URL` at build time. Vite's dev proxy does not ship with the built site.
4. Set backend `CORS_ORIGINS` to the exact frontend HTTPS origins.
5. Add TLS and edge-level rate limiting for the public inference and enquiry endpoints. CORS is a browser rule, not authentication or abuse protection.

Route pages and the Three.js photo viewer are lazy-loaded, so the heavy 3D chunk is only requested when the viewer opens. Fonts and photography load from Google Fonts and Unsplash; substitute licensed, self-hosted assets for offline use.

## 📚 Documentation

- [`docs/PRODUCT.md`](docs/PRODUCT.md) — product goals and scope
- [`docs/DESIGN.md`](docs/DESIGN.md) — design system and UI decisions
- [`docs/IMPLEMENTATION.md`](docs/IMPLEMENTATION.md) — implementation inventory, executed checks and verification limits
- [`ml/notebooks/ames_housing_price_prediction.ipynb`](ml/notebooks/ames_housing_price_prediction.ipynb) — original modelling notebook

## 🙏 Acknowledgements

- [Ames Housing dataset](https://www.kaggle.com/c/house-prices-advanced-regression-techniques) by Dean De Cock, via Kaggle
- [Supabase](https://supabase.com), [FastAPI](https://fastapi.tiangolo.com) and [scikit-learn](https://scikit-learn.org)
- Photography via [Unsplash](https://unsplash.com)

---

<div align="center">

Built with care by <a href="https://github.com/vranasinghe">@vranasinghe</a>

</div>

"""
Price-estimator API for the Aura Space website.

Run from the project root:
    python -m uvicorn backend.app:app --port 8000
"""
import sys
import os
import hashlib
import logging
from pathlib import Path
from typing import Literal, Optional

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field, model_validator

sys.path.insert(0, str(Path(__file__).resolve().parent))
from train_model import MODEL_PATH, add_features  # noqa: E402

if not MODEL_PATH.exists():
    raise SystemExit(f'{MODEL_PATH} not found. Run: python backend/train_model.py')

bundle = joblib.load(MODEL_PATH)
MODEL_A, MODEL_B = bundle['model_a'], bundle['model_b']
FEATURES, DEFAULTS = bundle['features'], bundle['defaults']

Quality = Literal['Po', 'Fa', 'TA', 'Gd', 'Ex']

MODEL_VERSION = hashlib.sha256(MODEL_PATH.read_bytes()).hexdigest()[:12]
SCOPE = {'location': 'Ames, Iowa, USA', 'sales_years': [2006, 2010], 'reference_year': 2010,
         'purpose': 'Historical housing ML demonstration; not a current appraisal or rental estimate.'}
TRANSPARENCY = {'currency': 'USD', 'model_version': MODEL_VERSION, 'scope': SCOPE,
                'band_method': 'estimate_plus_minus_test_mae', 'calibrated_interval': False,
                'importance_scope': 'Global Gradient Boosting impurity importance, not individual attribution',
                'uncollected_features': 'Stored training medians/modes and dependent-field assumptions'}
app = FastAPI(title='Aura Space Historical Ames Price Estimator', version='1.1.0',
              description='50/50 Ridge and Gradient Boosting inference on 2006–2010 Ames sales. Error bands are not confidence intervals.')
origins = os.getenv('CORS_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173').split(',')
app.add_middleware(CORSMiddleware, allow_origins=[o.strip() for o in origins if o.strip()],
                   allow_methods=['GET', 'POST'], allow_headers=['Content-Type'])


class HouseInput(BaseModel):
    """Only the details a visitor can reasonably know. Everything else uses a typical value."""
    Neighborhood: str
    OverallQual: int = Field(ge=1, le=10)
    OverallCond: int = Field(5, ge=1, le=10)
    YearBuilt: int = Field(ge=1872, le=2010)
    YearRemodAdd: Optional[int] = Field(None, ge=1950, le=2010)
    LotArea: int = Field(ge=1000, le=250000)
    TotalBsmtSF: int = Field(0, ge=0, le=6500)
    FirstFlrSF: int = Field(ge=300, le=5000)
    SecondFlrSF: int = Field(0, ge=0, le=3000)
    BedroomAbvGr: int = Field(3, ge=0, le=8)
    FullBath: int = Field(ge=0, le=4)
    HalfBath: int = Field(0, ge=0, le=3)
    BsmtFullBath: int = Field(0, ge=0, le=3)
    GarageCars: int = Field(0, ge=0, le=4)
    Fireplaces: int = Field(0, ge=0, le=4)
    ExterQual: Quality = 'TA'
    KitchenQual: Quality = 'TA'
    CentralAir: Literal['Y', 'N'] = 'Y'

    @model_validator(mode='after')
    def coherent_home(self):
        if self.Neighborhood not in bundle['neighborhoods']:
            raise ValueError('Select a supported Ames neighborhood')
        if self.YearRemodAdd is not None and self.YearRemodAdd < self.YearBuilt:
            raise ValueError('Remodel year must be on or after construction year')
        if self.TotalBsmtSF == 0 and self.BsmtFullBath > 0:
            raise ValueError('Basement bathrooms require a basement')
        return self


class PredictionResult(BaseModel):
    estimate: float = Field(description='Historical USD sale-price estimate, rounded to $100')
    low: float = Field(description='Estimate minus held-out test MAE, floored at zero and rounded')
    high: float = Field(description='Estimate plus held-out test MAE, rounded')
    typical_error: float = Field(description='Stored held-out test MAE in USD, not a per-home uncertainty estimate')
    currency: Literal['USD']
    model_version: str
    scope: dict
    band_method: Literal['estimate_plus_minus_test_mae']
    calibrated_interval: Literal[False]
    importance_scope: str
    uncollected_features: str


def to_raw_row(h: HouseInput) -> pd.DataFrame:
    if h.Neighborhood not in bundle['neighborhoods']:
        raise HTTPException(422, f'Unknown neighborhood: {h.Neighborhood}')
    row = dict(DEFAULTS)
    row.update({
        'Neighborhood': h.Neighborhood, 'OverallQual': h.OverallQual, 'OverallCond': h.OverallCond,
        'YearBuilt': h.YearBuilt, 'YearRemodAdd': h.YearRemodAdd or h.YearBuilt, 'LotArea': h.LotArea,
        'TotalBsmtSF': h.TotalBsmtSF, '1stFlrSF': h.FirstFlrSF, '2ndFlrSF': h.SecondFlrSF,
        'BedroomAbvGr': h.BedroomAbvGr, 'FullBath': h.FullBath, 'HalfBath': h.HalfBath,
        'BsmtFullBath': h.BsmtFullBath, 'GarageCars': h.GarageCars, 'Fireplaces': h.Fireplaces,
        'ExterQual': h.ExterQual, 'KitchenQual': h.KitchenQual, 'CentralAir': h.CentralAir,
    })
    # keep dependent fields consistent with what the visitor entered
    row['GrLivArea'] = h.FirstFlrSF + h.SecondFlrSF
    row['GarageArea'] = h.GarageCars * 280 if h.GarageCars else 0
    row['TotRmsAbvGrd'] = max(int(row['TotRmsAbvGrd']), h.BedroomAbvGr + 3)
    if h.GarageCars == 0:
        row.update({'GarageType': 'None', 'GarageFinish': 'None', 'GarageQual': 'None', 'GarageCond': 'None',
                    'GarageYrBlt': h.YearBuilt})
    if h.TotalBsmtSF == 0:
        row.update({'BsmtQual': 'None', 'BsmtCond': 'None', 'BsmtExposure': 'None', 'BsmtFinType1': 'None',
                    'BsmtFinType2': 'None', 'BsmtFinSF1': 0, 'BsmtUnfSF': 0})
    if h.Fireplaces == 0:
        row['FireplaceQu'] = 'None'
    return pd.DataFrame([row])


def predict_price(df_raw: pd.DataFrame) -> float:
    X = add_features(df_raw)[FEATURES]
    log_pred = 0.5 * MODEL_A.predict(X) + 0.5 * MODEL_B.predict(X)
    return float(np.expm1(log_pred)[0])


REPORT_DIR = Path(__file__).resolve().parent / 'report'
if (REPORT_DIR / 'figures').exists():
    app.mount('/api/figures', StaticFiles(directory=REPORT_DIR / 'figures'), name='figures')


@app.get('/api/report')
def report():
    import json
    path = REPORT_DIR / 'report.json'
    if not path.exists():
        raise HTTPException(404, 'No report available')
    return json.loads(path.read_text(encoding='utf-8'))


@app.get('/api/health')
def health():
    return {'status': 'ok'}


@app.get('/api/meta')
def meta():
    return {'neighborhoods': bundle['neighborhoods'], 'drivers': bundle['drivers'],
            'metrics': bundle['metrics'], 'trained_rows': bundle['trained_rows'], **TRANSPARENCY}


@app.post('/api/predict', response_model=PredictionResult,
          responses={422: {'description': 'Invalid or inconsistent home inputs'},
                     503: {'description': 'Model inference temporarily unavailable'}})
def predict(house: HouseInput):
    try:
        price = predict_price(to_raw_row(house))
        if not np.isfinite(price) or price <= 0:
            raise ValueError('Invalid model output')
    except HTTPException:
        raise
    except Exception:
        logging.exception('Model inference failed')
        raise HTTPException(503, 'Prediction unavailable. Please retry later.') from None
    mae = bundle['metrics']['test_mae']
    return {'estimate': round(price, -2), 'low': round(max(price - mae, 0), -2), 'high': round(price + mae, -2),
            'typical_error': mae, **TRANSPARENCY}


@app.post('/api/demonstrate', summary='Inspect real feature engineering and ensemble inference',
          responses={422: {'description': 'Invalid home inputs'}, 503: {'description': 'Inference unavailable'}})
def demonstrate(house: HouseInput):
    """Educational trace of the preserved artifact; no local feature attributions or retraining."""
    try:
        raw = to_raw_row(house)
        engineered = add_features(raw)
        X = engineered[FEATURES]
        ridge_log = float(MODEL_A.predict(X)[0])
        boosting_log = float(MODEL_B.predict(X)[0])
        blended_log = 0.5 * ridge_log + 0.5 * boosting_log
        price = float(np.expm1(blended_log))
        if not all(np.isfinite(v) for v in [ridge_log, boosting_log, price]) or price <= 0:
            raise ValueError('Invalid model output')
        counts = {name: int(model[:-1].transform(X).shape[1])
                  for name, model in [('ridge', MODEL_A), ('gradient_boosting', MODEL_B)]}
        trace = [
            {'name': 'TotalSF', 'label': 'Total floor area', 'value': float(engineered.TotalSF.iloc[0]),
             'formula': f'{house.TotalBsmtSF} basement + {house.FirstFlrSF} first floor + {house.SecondFlrSF} second floor (sq ft)'},
            {'name': 'TotalBath', 'label': 'Weighted bathroom count', 'value': float(engineered.TotalBath.iloc[0]),
             'formula': 'FullBath + 0.5 × HalfBath + BsmtFullBath + 0.5 × stored BsmtHalfBath'},
            {'name': 'HouseAge', 'label': 'Age at reference year', 'value': float(engineered.HouseAge.iloc[0]),
             'formula': f'max(2010 − {house.YearBuilt}, 0)'},
            {'name': 'RemodAge', 'label': 'Years since remodel', 'value': float(engineered.RemodAge.iloc[0]),
             'formula': f'max(2010 − {house.YearRemodAdd or house.YearBuilt}, 0)'},
        ]
        return {**TRANSPARENCY, 'estimate': round(price, -2), 'inputs': house.model_dump(),
                'feature_trace': trace, 'raw_columns': int(raw.shape[1]), 'retained_features': len(FEATURES),
                'encoded_features': counts,
                'components': {'ridge_log': ridge_log, 'gradient_boosting_log': boosting_log,
                               'ridge_usd': float(np.expm1(ridge_log)),
                               'gradient_boosting_usd': float(np.expm1(boosting_log)),
                               'blended_log': blended_log},
                'method': 'expm1(0.5 * ridge_log + 0.5 * gradient_boosting_log)',
                'note': 'Actual inference trace. Component dollar prices are displayed for context; averaging happens on log prices.'}
    except HTTPException:
        raise
    except Exception:
        logging.exception('Demonstration inference failed')
        raise HTTPException(503, 'Demonstration unavailable. Please retry later.') from None

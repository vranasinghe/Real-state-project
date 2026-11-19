"""API tests. Run from the project root:  python -m pytest backend/tests -q"""
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

if not (ROOT / 'backend' / 'artifacts' / 'model.joblib').exists():
    pytest.skip('model.joblib missing - run python backend/train_model.py first', allow_module_level=True)

from backend.app import app  # noqa: E402

client = TestClient(app)

TYPICAL = {'Neighborhood': 'NAmes', 'OverallQual': 6, 'YearBuilt': 1995, 'LotArea': 9500, 'TotalBsmtSF': 900,
           'FirstFlrSF': 1100, 'SecondFlrSF': 0, 'FullBath': 2, 'GarageCars': 2}


def price(**overrides):
    r = client.post('/api/predict', json={**TYPICAL, **overrides})
    assert r.status_code == 200, r.text
    return r.json()


def test_health():
    assert client.get('/api/health').json() == {'status': 'ok'}


def test_prediction_is_plausible_and_range_brackets_it():
    p = price()
    assert 80_000 < p['estimate'] < 300_000
    assert p['low'] < p['estimate'] < p['high']


def test_higher_quality_and_size_cost_more():
    assert price(OverallQual=9)['estimate'] > price(OverallQual=4)['estimate']
    assert price(FirstFlrSF=2200, SecondFlrSF=800)['estimate'] > price()['estimate']


def test_rejects_bad_input():
    assert client.post('/api/predict', json={**TYPICAL, 'OverallQual': 99}).status_code == 422
    assert client.post('/api/predict', json={**TYPICAL, 'Neighborhood': 'Atlantis'}).status_code == 422
    assert client.post('/api/predict', json={'Neighborhood': 'NAmes'}).status_code == 422


def test_meta_and_report_endpoints():
    meta = client.get('/api/meta').json()
    assert 'NAmes' in meta['neighborhoods'] and len(meta['drivers']) == 8
    report = client.get('/api/report').json()
    assert {s['split'] for s in report['splits']} == {'Train', 'Validation', 'Test'}
    assert client.get('/api/figures/feature_importance.png').status_code == 200


@pytest.mark.parametrize('overrides', [
    {'YearRemodAdd': 1980},
    {'TotalBsmtSF': 0, 'BsmtFullBath': 1},
    {'FirstFlrSF': 1100.5},
    {'CentralAir': 'maybe'},
    {'KitchenQual': 'luxury'},
    {'YearBuilt': 2026},
])
def test_rejects_incoherent_or_unsupported_home(overrides):
    assert client.post('/api/predict', json={**TYPICAL, **overrides}).status_code == 422


def test_transparent_scope_and_non_calibrated_band():
    p = price()
    meta = client.get('/api/meta').json()
    assert p['currency'] == 'USD'
    assert p['scope']['sales_years'] == [2006, 2010]
    assert p['scope']['reference_year'] == 2010
    assert p['calibrated_interval'] is False
    assert p['band_method'] == 'estimate_plus_minus_test_mae'
    assert p['model_version'] == meta['model_version']
    assert meta['metrics']['test_r2_log'] == 0.9049
    assert abs((p['high'] - p['low']) - 2 * p['typical_error']) <= 200


def test_api_uses_the_preserved_ensemble():
    from backend.app import HouseInput, to_raw_row, predict_price
    expected = round(predict_price(to_raw_row(HouseInput(**TYPICAL))), -2)
    assert price()['estimate'] == expected
    assert price()['estimate'] == price()['estimate']


def test_inference_failure_does_not_leak_internal_details(monkeypatch):
    import backend.app as module
    def fail(_):
        raise RuntimeError('private model internals')
    monkeypatch.setattr(module, 'predict_price', fail)
    response = client.post('/api/predict', json=TYPICAL)
    assert response.status_code == 503
    assert response.json() == {'detail': 'Prediction unavailable. Please retry later.'}

def test_demonstration_matches_real_ensemble_and_features():
    import numpy as np
    response = client.post('/api/demonstrate', json=TYPICAL)
    assert response.status_code == 200, response.text
    trace = response.json()
    assert trace['estimate'] == price()['estimate']
    parts = trace['components']
    assert trace['estimate'] == round(float(np.expm1(0.5 * parts['ridge_log'] + 0.5 * parts['gradient_boosting_log'])), -2)
    features = {f['name']: f['value'] for f in trace['feature_trace']}
    assert features['TotalSF'] == 2000
    assert features['HouseAge'] == 15
    assert features['RemodAge'] == 15
    assert trace['retained_features'] == 62
    assert trace['encoded_features']['ridge'] > 62
    assert trace['currency'] == 'USD'
    assert trace['calibrated_interval'] is False


def test_demonstration_changes_with_inputs_and_rejects_invalid_home():
    normal = client.post('/api/demonstrate', json=TYPICAL).json()
    improved = client.post('/api/demonstrate', json={**TYPICAL, 'OverallQual': 8}).json()
    assert improved['estimate'] > normal['estimate']
    assert client.post('/api/demonstrate', json={**TYPICAL, 'YearBuilt': 2026}).status_code == 422


def test_demonstration_failure_is_safe(monkeypatch):
    import backend.app as module
    def fail(_):
        raise RuntimeError('private preprocessing details')
    monkeypatch.setattr(module, 'add_features', fail)
    response = client.post('/api/demonstrate', json=TYPICAL)
    assert response.status_code == 503
    assert response.json() == {'detail': 'Demonstration unavailable. Please retry later.'}

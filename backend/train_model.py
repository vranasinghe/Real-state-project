"""
Train the final Ames Housing price model and save it for the API.

This reproduces the pipeline from notebooks/ames_housing_price_prediction.ipynb:
  row-level cleaning -> train-only fills -> outlier removal -> feature engineering
  -> feature reduction (62 features) -> encode/scale -> 50/50 ensemble of
  Ridge(alpha=10) + tuned Gradient Boosting, fitted on all labelled sales.

Usage (from the project root):
    python backend/train_model.py [path/to/train.csv]
"""
import sys
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.feature_selection import VarianceThreshold
from sklearn.impute import SimpleImputer
from sklearn.linear_model import Ridge
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import FunctionTransformer, OneHotEncoder, OrdinalEncoder, StandardScaler

SEED = 42
HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
DEFAULT_TRAIN = ROOT / "ml" / "data" / "ames-housing" / "train.csv"
MODEL_PATH = HERE / "artifacts" / "model.joblib"

# NA in these columns means "the house doesn't have it"
ABSENT_CAT = ['Alley', 'BsmtQual', 'BsmtCond', 'BsmtExposure', 'BsmtFinType1', 'BsmtFinType2', 'FireplaceQu',
              'GarageType', 'GarageFinish', 'GarageQual', 'GarageCond', 'PoolQC', 'Fence', 'MiscFeature', 'MasVnrType']
ABSENT_NUM = ['MasVnrArea', 'BsmtFinSF1', 'BsmtFinSF2', 'BsmtUnfSF', 'TotalBsmtSF',
              'BsmtFullBath', 'BsmtHalfBath', 'GarageCars', 'GarageArea']

# Columns removed by the notebook's feature-reduction step (B5-B7)
DROPPED = ['Street', 'Utilities', 'LandSlope', 'Condition2', 'YearBuilt', 'YearRemodAdd', 'RoofMatl', 'BsmtFinSF2',
           'TotalBsmtSF', 'Heating', 'LowQualFinSF', 'GrLivArea', 'BsmtHalfBath', 'KitchenAbvGr', 'Fireplaces',
           'GarageYrBlt', 'GarageArea', '3SsnPorch', 'PoolArea', 'PoolQC', 'MiscFeature', 'MiscVal', 'MoSold',
           'YrSold', 'HasBsmt', 'Has2ndFlr']

Q = ['Po', 'Fa', 'TA', 'Gd', 'Ex']
ORDER = {'ExterQual': Q, 'ExterCond': Q, 'HeatingQC': Q, 'KitchenQual': Q,
         'BsmtQual': ['None'] + Q, 'BsmtCond': ['None'] + Q, 'FireplaceQu': ['None'] + Q,
         'GarageQual': ['None'] + Q, 'GarageCond': ['None'] + Q, 'PoolQC': ['None'] + Q,
         'BsmtExposure': ['None', 'No', 'Mn', 'Av', 'Gd'],
         'BsmtFinType1': ['None', 'Unf', 'LwQ', 'Rec', 'BLQ', 'ALQ', 'GLQ'],
         'BsmtFinType2': ['None', 'Unf', 'LwQ', 'Rec', 'BLQ', 'ALQ', 'GLQ'],
         'GarageFinish': ['None', 'Unf', 'RFn', 'Fin'], 'PavedDrive': ['N', 'P', 'Y'],
         'Functional': ['Sal', 'Sev', 'Maj2', 'Maj1', 'Mod', 'Min2', 'Min1', 'Typ'],
         'LotShape': ['IR3', 'IR2', 'IR1', 'Reg'], 'CentralAir': ['N', 'Y']}

# Models predict log1p(price); settings are the notebook's validated choices.
RIDGE_PARAMS = dict(alpha=10)
GB_PARAMS = dict(learning_rate=0.03, max_depth=4, max_features=0.5, n_estimators=600,
                 subsample=0.8, min_samples_leaf=5, random_state=SEED)


def basic_clean(df):
    df = df.copy()
    df[ABSENT_CAT] = df[ABSENT_CAT].fillna('None')
    df[ABSENT_NUM] = df[ABSENT_NUM].fillna(0)
    df['GarageYrBlt'] = df['GarageYrBlt'].fillna(df['YearBuilt'])
    df['MSSubClass'] = df['MSSubClass'].astype(str)
    return df


def add_features(df):
    df = df.copy()
    df['TotalSF'] = df['TotalBsmtSF'] + df['1stFlrSF'] + df['2ndFlrSF']
    df['TotalBath'] = df['FullBath'] + 0.5 * df['HalfBath'] + df['BsmtFullBath'] + 0.5 * df['BsmtHalfBath']
    df['HouseAge'] = (df['YrSold'] - df['YearBuilt']).clip(lower=0)
    df['RemodAge'] = (df['YrSold'] - df['YearRemodAdd']).clip(lower=0)
    df['TotalPorchSF'] = df[['OpenPorchSF', 'EnclosedPorch', '3SsnPorch', 'ScreenPorch', 'WoodDeckSF']].sum(axis=1)
    df['HasGarage'] = (df['GarageArea'] > 0).astype(int)
    df['HasBsmt'] = (df['TotalBsmtSF'] > 0).astype(int)
    df['Has2ndFlr'] = (df['2ndFlrSF'] > 0).astype(int)
    df['HasFireplace'] = (df['Fireplaces'] > 0).astype(int)
    return df


def build_preprocessor(train_df, cols):
    numeric = train_df[cols].select_dtypes('number').columns
    skewed = [c for c in numeric if abs(train_df[c].skew()) > 0.75 and train_df[c].min() >= 0]
    normal = [c for c in numeric if c not in skewed]
    ordinal = [c for c in cols if c in ORDER]
    nominal = [c for c in cols if c not in numeric and c not in ORDER]
    return ColumnTransformer([
        ('skewed', Pipeline([('fill', SimpleImputer(strategy='median')),
                             ('log', FunctionTransformer(np.log1p, feature_names_out='one-to-one')),
                             ('scale', StandardScaler())]), skewed),
        ('normal', Pipeline([('fill', SimpleImputer(strategy='median')), ('scale', StandardScaler())]), normal),
        ('ordinal', Pipeline([('fill', SimpleImputer(strategy='most_frequent')),
                              ('encode', OrdinalEncoder(categories=[ORDER[c] for c in ordinal],
                                                        handle_unknown='use_encoded_value', unknown_value=-1)),
                              ('scale', StandardScaler())]), ordinal),
        ('nominal', Pipeline([('fill', SimpleImputer(strategy='most_frequent')),
                              ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))]), nominal),
    ])


def make_pipeline(train_df, cols, model):
    return Pipeline([('prep', build_preprocessor(train_df, cols)),
                     ('var', VarianceThreshold(0.01)),
                     ('model', model)])


def main():
    train_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_TRAIN
    raw = pd.read_csv(train_path)
    print(f'Loaded {train_path.name}: {raw.shape}')

    full = basic_clean(raw).drop_duplicates(subset=raw.columns.drop('Id'))
    lot_by_area = full.groupby('Neighborhood')['LotFrontage'].median()
    lot_median = full['LotFrontage'].median()
    electrical_mode = full['Electrical'].mode()[0]
    full['LotFrontage'] = full['LotFrontage'].fillna(full['Neighborhood'].map(lot_by_area)).fillna(lot_median)
    full['Electrical'] = full['Electrical'].fillna(electrical_mode)
    full = add_features(full)
    full = full[~((full['GrLivArea'] > 4000) & (full['SalePrice'] < 300000))]
    y = np.log1p(full['SalePrice'])

    all_cols = [c for c in full.columns if c not in ('Id', 'SalePrice')]
    features = [c for c in all_cols if c not in DROPPED]
    assert len(features) == 62, f'expected 62 features, got {len(features)}'

    model_a = make_pipeline(full, features, Ridge(**RIDGE_PARAMS)).fit(full[features], y)
    model_b = make_pipeline(full, features, GradientBoostingRegressor(**GB_PARAMS)).fit(full[features], y)

    # Defaults used for any input the website form does not ask for (typical house).
    raw_cols = [c for c in raw.columns if c not in ('Id', 'SalePrice')]
    defaults = {}
    for c in raw_cols:
        s = full[c]
        v = s.median() if pd.api.types.is_numeric_dtype(s) else s.mode()[0]
        defaults[c] = v.item() if hasattr(v, 'item') else v
    defaults['YrSold'] = 2010   # historical serving reference year; not the current year

    # Top drivers from the tree model, for display next to the estimate
    names = [n.split('__')[-1] for n in model_b[:-1].get_feature_names_out()]
    imp = pd.Series(model_b.named_steps['model'].feature_importances_, index=names).nlargest(8)

    # Honest hold-out numbers measured in the notebook (not recomputed on training data)
    metrics = {'test_rmse': 21673, 'test_mae': 13981, 'test_r2_log': 0.9049}

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump({
        'model_a': model_a, 'model_b': model_b, 'features': features, 'defaults': defaults,
        'neighborhoods': sorted(full['Neighborhood'].unique().tolist()),
        'drivers': [{'name': k, 'importance': round(float(v), 4)} for k, v in imp.items()],
        'metrics': metrics, 'trained_rows': int(len(full)),
    }, MODEL_PATH)
    print(f'Saved {MODEL_PATH} (trained on {len(full)} rows, {len(features)} features)')


if __name__ == '__main__':
    main()

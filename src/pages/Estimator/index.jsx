import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Check, Loader2, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { modelRequest } from '../../lib/modelApi';

const NAMES = { Blmngtn:'Bloomington Heights', Blueste:'Bluestem', BrDale:'Briardale', BrkSide:'Brookside', ClearCr:'Clear Creek', CollgCr:'College Creek', Crawfor:'Crawford', Edwards:'Edwards', Gilbert:'Gilbert', IDOTRR:'Iowa DOT & Rail Road', MeadowV:'Meadow Village', Mitchel:'Mitchell', NAmes:'North Ames', NoRidge:'Northridge', NPkVill:'Northpark Villa', NridgHt:'Northridge Heights', NWAmes:'Northwest Ames', OldTown:'Old Town', SWISU:'South & West of Iowa State', Sawyer:'Sawyer', SawyerW:'Sawyer West', Somerst:'Somerset', StoneBr:'Stone Brook', Timber:'Timberland', Veenker:'Veenker' };
const QUALITY = [['Po','Poor'],['Fa','Fair'],['TA','Average'],['Gd','Good'],['Ex','Excellent']];
const INITIAL = { Neighborhood:'NAmes', OverallQual:6, OverallCond:5, YearBuilt:1995, YearRemodAdd:'', LotArea:9500, TotalBsmtSF:900, FirstFlrSF:1100, SecondFlrSF:0, BedroomAbvGr:3, FullBath:2, HalfBath:0, BsmtFullBath:0, GarageCars:2, Fireplaces:0, ExterQual:'TA', KitchenQual:'TA', CentralAir:'Y' };
const STEPS = ['Location & basics', 'Space & dimensions', 'Quality & facilities', 'Review & estimate'];
const FIELDS = [
  [['Neighborhood','Ames neighborhood','select'],['OverallQual','Overall quality',1,10,'1 = very poor, 10 = excellent'],['OverallCond','Overall condition',1,10,'Rate the current condition separately from build quality.'],['YearBuilt','Construction year',1872,2010]],
  [['LotArea','Lot area (sq ft)',1000,250000],['FirstFlrSF','First-floor area (sq ft)',300,5000],['SecondFlrSF','Second-floor area (sq ft)',0,3000,'Enter 0 for a single-storey home.'],['TotalBsmtSF','Basement area (sq ft)',0,6500],['BedroomAbvGr','Above-ground bedrooms',0,8],['FullBath','Full bathrooms above ground',0,4],['HalfBath','Half bathrooms above ground',0,3],['BsmtFullBath','Basement full bathrooms',0,3]],
  [['ExterQual','Exterior quality','quality'],['KitchenQual','Kitchen quality','quality'],['CentralAir','Central air conditioning','air'],['GarageCars','Garage capacity (cars)',0,4],['Fireplaces','Fireplaces',0,4],['YearRemodAdd','Remodel year (optional)',1950,2010,'Leave blank to use the construction year.']],
];
const DRIVER_NAMES = { OverallQual:'Overall quality', TotalSF:'Total floor area including basement', ExterQual:'Exterior quality', TotalBath:'Bathrooms', GarageCars:'Garage capacity', GarageFinish:'Garage finish', LotArea:'Lot area', KitchenQual:'Kitchen quality', HouseAge:'House age' };
const usd = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
function payload(form) { return Object.fromEntries(Object.entries(form).map(([k,v]) => [k, ['Neighborhood','ExterQual','KitchenQual','CentralAir'].includes(k) ? v : v === '' ? null : Number(v)])); }
function validate(form) {
  const errors = {};
  FIELDS.flat().forEach(([key,label,min,max]) => {
    if (typeof min !== 'number' || (key === 'YearRemodAdd' && form[key] === '')) return;
    const n = Number(form[key]);
    if (form[key] === '' || !Number.isInteger(n) || n < min || n > max) errors[key] = `${label} must be a whole number from ${min.toLocaleString()} to ${max.toLocaleString()}.`;
  });
  if (form.YearRemodAdd !== '' && Number(form.YearRemodAdd) < Number(form.YearBuilt)) errors.YearRemodAdd = 'Remodel year cannot be earlier than construction year.';
  if (Number(form.TotalBsmtSF) === 0 && Number(form.BsmtFullBath) > 0) errors.BsmtFullBath = 'Add basement area or set basement bathrooms to 0.';
  return errors;
}
function Summary({ form }) {
  return <div className="review-groups">{FIELDS.map((group,i) => <section key={i}><h3>{STEPS[i]}</h3><dl>{group.map(([key,label]) => <div key={key}><dt>{label}</dt><dd>{key === 'Neighborhood' ? NAMES[form[key]] || form[key] : key === 'CentralAir' ? (form[key] === 'Y' ? 'Yes' : 'No') : ['ExterQual','KitchenQual'].includes(key) ? QUALITY.find(q => q[0] === form[key])?.[1] : form[key] === '' ? `Construction year (${form.YearBuilt})` : ['YearBuilt','YearRemodAdd'].includes(key) ? form[key] : Number(form[key]).toLocaleString()}</dd></div>)}</dl></section>)}</div>;
}
export default function Estimator() {
  const [form,setForm] = useState(INITIAL);
  const [step,setStep] = useState(0);
  const [meta,setMeta] = useState(null);
  const [metaLoading,setMetaLoading] = useState(true);
  const [attempt,setAttempt] = useState(0);
  const [offline,setOffline] = useState('');
  const [errors,setErrors] = useState({});
  const [error,setError] = useState('');
  const [busy,setBusy] = useState(false);
  const [result,setResult] = useState(null);
  const [snapshot,setSnapshot] = useState(null);
  const [scenario,setScenario] = useState(null);
  const [comparison,setComparison] = useState(null);
  const [scenarioBusy,setScenarioBusy] = useState(false);
  const [scenarioError,setScenarioError] = useState('');
  const heading = useRef(null);
  const resultRef = useRef(null);
  useEffect(() => {
    let live = true;
    const controller = new AbortController();
    setMetaLoading(true); setOffline('');
    modelRequest('meta',undefined,controller.signal).then(data => { if(live) setMeta(data); }).catch(err => { if(live) setOffline(err.message); }).finally(() => { if(live) setMetaLoading(false); });
    return () => { live = false; controller.abort(); };
  },[attempt]);
  const change = key => e => { setForm(f => ({...f,[key]:e.target.value})); setErrors({}); setError(''); };
  const go = next => { setStep(next); setError(''); requestAnimationFrame(() => heading.current?.focus()); };
  async function submit(e) {
    e.preventDefault();
    const invalid = validate(form);
    const relevant = step < 3 ? FIELDS[step].map(f => f[0]) : Object.keys(invalid);
    if(relevant.some(key => invalid[key])) { setErrors(invalid); setError('Please check the highlighted fields before continuing.'); return; }
    if(step < 3) { go(step+1); return; }
    if(Object.keys(invalid).length) { setErrors(invalid); go(FIELDS.findIndex(g => g.some(f => invalid[f[0]]))); return; }
    setBusy(true); setError('');
    try {
      const data = await modelRequest('predict',payload(form));
      setResult(data); setSnapshot({...form}); setScenario({ OverallQual:form.OverallQual, FirstFlrSF:form.FirstFlrSF }); setComparison(null); setScenarioError('');
      requestAnimationFrame(() => { resultRef.current?.scrollIntoView({behavior:'smooth',block:'start'}); resultRef.current?.focus({preventScroll:true}); });
    } catch(err) { setError(err.message); } finally { setBusy(false); }
  }
  async function compare(e) {
    e.preventDefault();
    const alternative = {...snapshot,...scenario};
    const invalid = validate(alternative);
    if(Object.keys(invalid).length) { setScenarioError(Object.values(invalid).join(' ')); return; }
    setScenarioBusy(true); setScenarioError(''); setComparison(null);
    try { const prediction = await modelRequest('predict',payload(alternative)); setComparison({ ...prediction, quality:scenario.OverallQual, area:scenario.FirstFlrSF }); }
    catch(err) { setScenarioError(err.message); } finally { setScenarioBusy(false); }
  }
  return <div className="workspace-page"><header className="workspace-header cm-section"><Link to="/model-report" className="text-link">Explore the model case study</Link><h1>A home’s details.<br /><span>A model’s perspective.</span></h1><p>Describe a home in Ames, Iowa. Explore a real machine-learning estimate, one thoughtful step at a time.</p><div className="scope-notice"><ShieldScope /> Historical demonstration · Ames sales, 2006–2010 · Prices in USD</div></header>
    <div className="cm-section estimator-layout"><div>
      <ol className="stepper" aria-label="Estimation progress">{STEPS.map((label,i) => <li key={label} aria-current={step === i ? 'step' : undefined}><span className={i <= step ? 'reached' : ''}>{i < step ? <Check size={17} /> : i+1}</span><small>{label}</small></li>)}</ol>
      <form onSubmit={submit} noValidate className="estimator-form" aria-busy={busy}>
        <div className="form-heading"><p>Step {step+1} of 4</p><h2 ref={heading} tabIndex={-1}>{STEPS[step]}</h2><p>{['Choose a supported neighborhood and describe the original home.','All dimensions are in square feet. Include only the areas requested.','Finish with the details that distinguish the property.','Check all 18 inputs before requesting your estimate.'][step]}</p></div>
        {step < 3 ? <div className="field-grid">{FIELDS[step].map(([key,label,min,max,hint]) => <div className="form-field" key={key}><label htmlFor={key}>{label}</label>{typeof min === 'number' ? <input id={key} type="number" min={min} max={max} step="1" required={key !== 'YearRemodAdd'} value={form[key]} onChange={change(key)} aria-invalid={!!errors[key]} aria-describedby={errors[key] || hint ? `${key}-help` : undefined} /> : <select id={key} value={form[key]} onChange={change(key)}>{(min === 'select' ? (meta?.neighborhoods || Object.keys(NAMES)).map(n => [n,NAMES[n] || n]) : min === 'quality' ? QUALITY : [['Y','Yes'],['N','No']]).map(([value,text]) => <option key={value} value={value}>{text}</option>)}</select>}{(errors[key] || hint) && <p id={`${key}-help`} className={errors[key] ? 'field-error' : ''}>{errors[key] || hint}</p>}</div>)}</div> : <Summary form={form} />}
        {error && <p role="alert" className="error-notice">{error}</p>}
        <div className="form-actions">{step > 0 && <button className="cm-button secondary" type="button" disabled={busy} onClick={() => go(step-1)}>Back</button>}<button type="submit" className="cm-button" disabled={busy || (step === 3 && !meta)}>{busy ? <Loader2 className="animate-spin" size={18} /> : step === 3 ? <Calculator size={18} /> : null}{busy ? 'Running the model…' : step === 3 ? 'Estimate Price' : 'Continue'}</button></div>
      </form>
    </div><aside className="estimator-aside"><div className="aside-intro"><Calculator size={28} /><h2>Designed for curiosity.<br />Grounded in data.</h2><p>Ridge regression and tuned Gradient Boosting each contribute half of the log-price prediction.</p><dl className="aside-facts"><div><dt>Location</dt><dd>Ames, Iowa</dd></div><div><dt>Sale period</dt><dd>2006–2010</dd></div><div><dt>Training rows</dt><dd>{meta?.trained_rows?.toLocaleString() || 'See model report'}</dd></div><div><dt>Reference year</dt><dd>2010</dd></div></dl><p>Uncollected features use stored typical values. This is not a current appraisal and does not support other cities or rental prices.</p></div>
      <div className="service-status" role="status">{metaLoading ? 'Connecting to model service…' : offline ? <><p>{offline}</p><button type="button" className="text-link" onClick={() => setAttempt(a => a+1)}>Retry connection</button></> : 'Model service connected. Ready for inference.'}</div>
      <Link to="/model-report" className="text-link">Read the methodology & limitations</Link>
    </aside></div>
    {result && <section className="cm-section result-section" ref={resultRef} tabIndex={-1} aria-label="Prediction results"><div className="section-heading"><div><h2>Your historical price estimate.</h2><p>For the submitted Ames property, at the model’s 2010 reference year.</p></div><button className="cm-button secondary" onClick={() => go(0)}><RotateCcw size={16} />Revise inputs</button></div>
      {JSON.stringify(snapshot) !== JSON.stringify(form) && <p className="notice">You have changed the form. These results still describe your last submitted property. Complete review and estimate again to update them.</p>}
      <div className="result-layout"><div><div className="estimate-panel" aria-live="polite"><span>Estimated sale price · USD</span><strong>{usd(result.estimate)}</strong><p>MAE reference band: {usd(result.low)} – {usd(result.high)}</p><small>Estimate ± {usd(result.typical_error)} test MAE. This is not a calibrated confidence interval, and actual errors may be larger.</small></div><details className="submitted-summary"><summary>View the submitted property details</summary><Summary form={snapshot} /></details>
      <form className="what-if" onSubmit={compare}><h3><SlidersHorizontal size={20} /> What if you changed the home?</h3><p>Change quality or first-floor area. All other submitted inputs stay fixed. Each comparison runs the real model.</p><div className="field-grid">{[['OverallQual','Overall quality',1,10],['FirstFlrSF','First-floor area (sq ft)',300,5000]].map(([key,label,min,max]) => <label className="form-field" key={key}>{label}<input type="number" min={min} max={max} step="1" required value={scenario[key]} disabled={scenarioBusy} onChange={e => { setScenario(s => ({...s,[key]:e.target.value})); setComparison(null); }} /></label>)}</div><button className="cm-button" disabled={scenarioBusy}>{scenarioBusy ? 'Comparing…' : 'Compare scenario'}</button>{scenarioError && <p role="alert" className="error-notice">{scenarioError}</p>}{comparison && <div className="comparison-result" aria-live="polite"><p>Original: {usd(result.estimate)} · Scenario: <strong>{usd(comparison.estimate)}</strong></p><p>Difference: {comparison.estimate-result.estimate >= 0 ? '+' : '−'}{usd(Math.abs(comparison.estimate-result.estimate))}</p><small>Quality {comparison.quality}/10 · First floor {Number(comparison.area).toLocaleString()} sq ft. This is model sensitivity, not the causal return on a renovation.</small></div>}</form></div>
      <div className="insights-panel"><h3>What the model looks at</h3><p>Global importance from the Gradient Boosting component. These are model-wide patterns, not explanations of this individual estimate.</p>{meta?.drivers?.map(d => <div className="driver" key={d.name}><div><span>{DRIVER_NAMES[d.name] || d.name}</span><small>{(d.importance*100).toFixed(1)}%</small></div><div className="driver-track"><span style={{width:`${Math.min(d.importance*100,100)}%`}} /></div></div>)}<p>Reported held-out MAE measures average absolute dollar error. R² is measured on log prices; it is not a prediction accuracy percentage. The served artifact was fitted on all cleaned labelled rows after model selection.</p><Link to="/model-report" className="text-link">View the complete machine-learning report</Link></div></div>
    </section>}
  </div>;
}
function ShieldScope() { return <Check size={16} aria-hidden="true" />; }

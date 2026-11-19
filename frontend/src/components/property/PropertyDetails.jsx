import React, { lazy, Suspense, useState } from 'react';
import { Loader2, Check } from 'lucide-react';
const VirtualTour360 = lazy(() => import('../three/VirtualTour360'));
export default function PropertyDetails({property}) {
  const [tab,setTab] = useState('Overview');
  const tabs = ['Overview','Features','Photo preview','Location','Floor Plan'];
  const rooms = (property.images?.length ? property.images : [property.image]).filter(Boolean).map((image,i) => ({label:`Photo ${i+1}`,image}));
  return <div className="space-y-8"><dl className="property-specs">{[['Bedrooms',property.beds],['Bathrooms',property.baths],['Area',`${property.sqft.toLocaleString()} sq ft`],['Garage',property.garage == null ? 'Not specified' : `${property.garage} cars`],['Year built',property.yearBuilt || 'Not specified']].map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <div className="property-tabs" role="tablist" aria-label="Property information">{tabs.map((name,i) => <button key={name} id={`property-tab-${i}`} role="tab" aria-selected={tab === name} aria-controls="property-panel" tabIndex={tab === name ? 0 : -1} onClick={() => setTab(name)} onKeyDown={e => { if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) { e.preventDefault(); const next = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length-1 : (i+(e.key === 'ArrowRight' ? 1 : -1)+tabs.length)%tabs.length; setTab(tabs[next]); document.getElementById(`property-tab-${next}`)?.focus(); } }}>{name}</button>)}</div>
    <div role="tabpanel" id="property-panel" aria-labelledby={`property-tab-${tabs.indexOf(tab)}`} className="property-panel" tabIndex={0}>
      {tab === 'Overview' && <><h2>About this property</h2><p className="whitespace-pre-line">{property.description || 'No description has been supplied.'}</p></>}
      {tab === 'Features' && <><h2>Listed features</h2><ul className="grid sm:grid-cols-2 gap-4 mt-5">{(property.features || []).map(feature => <li className="flex items-center gap-3" key={feature}><Check size={18} className="text-primary" />{feature}</li>)}</ul>{!property.features?.length && <p>No features have been supplied.</p>}</>}
      {tab === 'Photo preview' && <><h2>Interactive photo preview</h2><p>Drag to explore the supplied listing photos and scroll to zoom. Ordinary photos are projected for demonstration; this is not a verified 360-degree property tour.</p>{rooms.length > 0 ? <Suspense fallback={<div role="status" className="skeleton h-80 flex items-center justify-center gap-3"><Loader2 className="animate-spin" />Loading photo viewer…</div>}><VirtualTour360 image={property.image} rooms={rooms} /></Suspense> : <p>No photographs are available to preview.</p>}</>}
      {tab === 'Location' && <><h2>Location</h2><p>{property.location}. Confirm local amenities and travel distances with the listing contact.</p><iframe title={`Map of ${property.location}`} src={`https://maps.google.com/maps?q=${encodeURIComponent(property.location)}&z=13&output=embed`} className="w-full h-80 border-0 rounded-card" loading="lazy" allowFullScreen /></>}
      {tab === 'Floor Plan' && <><h2>Floor plan availability</h2><p>No verified floor plan has been supplied. Ask the listing contact for dimensions and a current plan.</p></>}
    </div></div>;
}

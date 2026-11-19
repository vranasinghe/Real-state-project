import React, { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize } from 'lucide-react';
export default function PropertyGallery({ mainImage, images: supplied = [], title }) {
  const images = [...new Set([mainImage,...supplied].filter(Boolean))];
  const [active,setActive] = useState(0);
  const dialog = useRef(null);
  useEffect(() => { setActive(0); },[mainImage]);
  const index = Math.min(active,images.length-1);
  const previous = () => setActive(i => (i-1+images.length)%images.length);
  const next = () => setActive(i => (i+1)%images.length);
  if(!images.length) return <div className="notice">No property photographs have been supplied.</div>;
  return <div className="property-gallery"><div className="gallery-main"><img src={images[index]} alt={`${title}, photograph ${index+1}`} /><button className="gallery-expand" aria-label="Enlarge property photograph" onClick={() => dialog.current.showModal()}><Maximize size={20} /></button>{images.length > 1 && <div className="gallery-controls"><button aria-label="Previous photograph" onClick={previous}><ChevronLeft /></button><span>{index+1} / {images.length}</span><button aria-label="Next photograph" onClick={next}><ChevronRight /></button></div>}</div>{images.length > 1 && <div className="gallery-thumbnails">{images.map((src,i) => <button key={src} aria-label={`Show photograph ${i+1}`} aria-pressed={i === index} onClick={() => setActive(i)}><img src={src} alt="" loading="lazy" /></button>)}</div>}<dialog ref={dialog} className="gallery-dialog" aria-label={`${title} photo gallery`} onClick={e => { if(e.target === e.currentTarget) dialog.current.close(); }} onKeyDown={e => { if(e.key === 'ArrowLeft') previous(); if(e.key === 'ArrowRight') next(); }}><button className="dialog-close" aria-label="Close photo gallery" onClick={() => dialog.current.close()}><X /></button><img src={images[index]} alt={`${title}, photograph ${index+1}`} />{images.length > 1 && <div className="gallery-controls"><button aria-label="Previous photograph" onClick={previous}><ChevronLeft /></button><span>{index+1} / {images.length}</span><button aria-label="Next photograph" onClick={next}><ChevronRight /></button></div>}</dialog></div>;
}

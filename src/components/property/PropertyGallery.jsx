import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize } from 'lucide-react';

export const PropertyGallery = ({ mainImage, title }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Gallery images (main plus high-quality interior alternates)
  const images = [
    mainImage,
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1552321554-5fefe8c96163?auto=format&fit=crop&w=1200&q=80"
  ];

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Large Main Image */}
      <div className="relative h-[480px] rounded-card overflow-hidden group shadow-md bg-gray-100">
        <img
          src={images[activeImageIndex]}
          alt={`${title} - View ${activeImageIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-102"
        />
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute bottom-4 right-4 bg-white/95 hover:bg-white text-textDark p-2.5 rounded-full shadow-lg transition-transform active:scale-95 flex items-center justify-center"
        >
          <Maximize className="w-5 h-5 text-primary" />
        </button>

        {/* Arrow Navigation */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 hover:bg-white text-textDark hover:text-primary rounded-full shadow-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 active:scale-90"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 hover:bg-white text-textDark hover:text-primary rounded-full shadow-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 active:scale-90"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Thumbnails row */}
      <div className="grid grid-cols-5 gap-3">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImageIndex(idx)}
            className={`h-24 rounded-card overflow-hidden border-2 transition-all relative ${
              activeImageIndex === idx ? 'border-primary scale-[0.98] shadow-sm' : 'border-transparent hover:opacity-85'
            }`}
          >
            <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            {activeImageIndex === idx && (
              <div className="absolute inset-0 bg-primary/10"></div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col justify-center items-center p-4 animate-fade-in"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-primary p-2 transition-colors focus:outline-none"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Large Lightbox Slider */}
          <div className="relative max-w-5xl w-full max-h-[80vh] flex justify-center items-center">
            <img
              src={images[activeImageIndex]}
              alt={`Full size ${activeImageIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Controls */}
            <button
              onClick={handlePrev}
              className="absolute left-0 sm:-left-16 w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all active:scale-90"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 sm:-right-16 w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all active:scale-90"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          {/* Indicator */}
          <div className="mt-6 text-white/60 font-heading font-semibold text-sm">
            {activeImageIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;

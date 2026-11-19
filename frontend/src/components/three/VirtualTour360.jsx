import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import { Move3d, Loader2 } from 'lucide-react';
import * as THREE from 'three';

function PanoramaSphere({ image }) {
  const texture = useTexture(image);
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh scale={[-1, 1, 1]}>
      {/* Large sphere, viewed from the inside */}
      <sphereGeometry args={[10, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-darkGreen/95 text-white gap-2">
      <Loader2 className="w-5 h-5 animate-spin" />
      <span className="text-sm font-heading font-semibold">Loading tour…</span>
    </div>
  );
}

/**
 * Drag-to-look-around panorama viewer. Maps a photo onto the inside of a
 * sphere so the user can orbit the camera and explore the room, similar to
 * a basic 360° virtual-tour widget. For a production listing site, swap the
 * `image` prop for a true equirectangular (360°) photo per room to get a
 * seamless wrap; a standard photo will still work but shows visible seams.
 */
export const VirtualTour360 = ({ image, rooms = [] }) => {
  const [activeImage, setActiveImage] = useState(image);

  return (
    <div className="space-y-3">
      <div className="relative w-full h-[420px] rounded-card overflow-hidden border border-borderLight bg-darkGreen shadow-md">
        <Suspense fallback={<Loader />}>
          <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
            <PanoramaSphere image={activeImage} />
            <OrbitControls
              enableZoom={true}
              enablePan={false}
              rotateSpeed={-0.4}
              zoomSpeed={0.6}
              minDistance={0.1}
              maxDistance={5}
            />
          </Canvas>
        </Suspense>

        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white text-xs font-heading font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 pointer-events-none">
          <Move3d className="w-3.5 h-3.5 text-primary" />
          Drag to look around · Scroll to zoom
        </div>
      </div>

      {rooms.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {rooms.map((room, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(room.image)}
              className={`shrink-0 px-4 py-2 rounded-btn text-xs font-heading font-bold border transition-colors ${
                activeImage === room.image
                  ? 'bg-primary text-white border-primary'
                  : 'bg-cardBg text-textMuted border-borderLight hover:text-textDark'
              }`}
            >
              {room.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default VirtualTour360;

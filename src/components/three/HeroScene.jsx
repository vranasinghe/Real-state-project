import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, ContactShadows, Icosahedron, Torus } from '@react-three/drei';

// Colors pulled from tailwind.config.js so the 3D scene matches the site's palette
const PRIMARY = '#27AE60';
const PRIMARY_LIGHT = '#E8F5E9';
const DARK_GREEN = '#1A3C34';
const CREAM = '#F9FAFB';

/**
 * A stylized low-poly "house" built entirely from primitive geometries
 * (no external .glb/.gltf model needed — keeps the bundle light and avoids
 * any asset licensing concerns).
 */
function AbstractHouse() {
  const group = useRef();

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.15; // slow continuous spin
    }
  });

  return (
    <group ref={group}>
      {/* Base plinth */}
      <mesh position={[0, -0.95, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.4, 0.15, 2]} />
        <meshStandardMaterial color={DARK_GREEN} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* House body */}
      <mesh position={[0, -0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 1.2, 1.4]} />
        <meshStandardMaterial color={CREAM} roughness={0.5} metalness={0.05} />
      </mesh>

      {/* Pyramid roof */}
      <mesh position={[0, 0.6, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.35, 0.85, 4]} />
        <meshStandardMaterial color={PRIMARY} roughness={0.35} metalness={0.2} />
      </mesh>

      {/* Door */}
      <mesh position={[0, -0.62, 0.71]}>
        <boxGeometry args={[0.32, 0.55, 0.02]} />
        <meshStandardMaterial color={DARK_GREEN} roughness={0.4} />
      </mesh>

      {/* Glowing windows */}
      {[[-0.5, -0.15, 0.71], [0.5, -0.15, 0.71], [0.81, -0.15, -0.3], [-0.81, -0.15, -0.3]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.28, 0.28, 0.02]} />
          <meshStandardMaterial
            color={PRIMARY_LIGHT}
            emissive={PRIMARY}
            emissiveIntensity={0.6}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

function FloatingAccents() {
  return (
    <>
      <Float speed={1.4} rotationIntensity={1.2} floatIntensity={1.6} position={[-2.6, 1.1, -1]}>
        <Icosahedron args={[0.28, 0]}>
          <meshStandardMaterial color={PRIMARY} roughness={0.3} metalness={0.4} wireframe />
        </Icosahedron>
      </Float>
      <Float speed={1.1} rotationIntensity={1} floatIntensity={1.2} position={[2.4, -0.6, -0.6]}>
        <Torus args={[0.28, 0.09, 16, 32]}>
          <meshStandardMaterial color={CREAM} roughness={0.3} metalness={0.5} />
        </Torus>
      </Float>
      <Float speed={1.8} rotationIntensity={0.8} floatIntensity={1.4} position={[2.1, 1.4, -1.2]}>
        <Icosahedron args={[0.14, 0]}>
          <meshStandardMaterial color={PRIMARY_LIGHT} roughness={0.4} />
        </Icosahedron>
      </Float>
    </>
  );
}

export const HeroScene = ({ className = '' }) => {
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [3.2, 1.4, 4.2], fov: 40 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight
          position={[4, 5, 3]}
          intensity={1.1}
          color="#ffffff"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-3, 1, -2]} intensity={0.6} color={PRIMARY} />

        <Suspense fallback={null}>
          <Float speed={1} rotationIntensity={0.15} floatIntensity={0.5}>
            <AbstractHouse />
          </Float>
          <FloatingAccents />
          <Sparkles count={40} scale={5} size={2} speed={0.25} color={PRIMARY_LIGHT} opacity={0.5} />
          <ContactShadows position={[0, -1.05, 0]} opacity={0.45} scale={6} blur={2.4} far={2} color={DARK_GREEN} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroScene;

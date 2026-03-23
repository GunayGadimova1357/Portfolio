"use client";

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from './Stars';

type SceneProps = {
  className?: string;
  starOpacity?: number;
};

export default function Scene({
  className = '',
  starOpacity = 0.35,
}: SceneProps) {
  return (
    <div className={`pointer-events-none ${className}`.trim()}>
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0, 4.5], fov: 34 }}>
          <color attach="background" args={['#000000']} />
          <ambientLight intensity={0.3} />
          <directionalLight position={[2, 1, 3]} intensity={1.2} color="#f8f8ff" />
          <pointLight position={[2.6, 0.2, 1.5]} intensity={0.8} distance={10} color="#f4f4ff" />
          <Stars opacity={starOpacity} />
        </Canvas>
      </Suspense>
    </div>
  );
}

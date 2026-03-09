"use client";

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type ParticlesData = {
  positions: Float32Array;
  randomness: Float32Array;
  baseDepth: Float32Array;
  baseY: Float32Array;
  amplitude: Float32Array;
  sizeBias: Float32Array;
};

const createParticles = (count: number): ParticlesData => {
  const positions = new Float32Array(count * 3);
  const randomness = new Float32Array(count);
  const baseDepth = new Float32Array(count);
  const baseY = new Float32Array(count);
  const amplitude = new Float32Array(count);
  const sizeBias = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const spread = Math.pow(Math.random(), 2.6);
    const direction = Math.random() > 0.5 ? 1 : -1;
    const x = (Math.random() - 0.5) * 14;
    const y = direction * spread * 1.35;
    const z = (Math.random() - 0.5) * 1.4;

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;
    randomness[i] = Math.random();
    baseDepth[i] = z;
    baseY[i] = y;
    amplitude[i] = 0.015 + Math.random() * 0.06;
    sizeBias[i] = 0.35 + Math.pow(1 - Math.min(Math.abs(y) / 1.35, 1), 2) * 0.65;
  }

  return { positions, randomness, baseDepth, baseY, amplitude, sizeBias };
};

const PARTICLE_COUNT = 18000;
const particles = createParticles(PARTICLE_COUNT);

type StarsProps = {
  opacity?: number;
};

export function Stars({ opacity = 0.4 }: StarsProps) {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.opacity = opacity;
    }
  }, [opacity]);

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;
    const positionAttr = meshRef.current.geometry.attributes.position;
    if (!positionAttr) return;

    timeRef.current += delta;
    const time = timeRef.current;
    const pos = positionAttr.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const x = pos[i3];
      const bandWave =
        Math.sin(x * 0.55 + time * 0.22) * 0.11 +
        Math.sin(x * 1.35 - time * 0.16) * 0.06;
      const shimmer = Math.sin(time * (0.45 + particles.randomness[i] * 0.4) + x * 0.8) * particles.amplitude[i];

      pos[i3 + 1] = particles.baseY[i] + bandWave * particles.sizeBias[i] + shimmer;
      pos[i3 + 2] =
        particles.baseDepth[i] +
        Math.sin(time * 0.18 + x * 0.4 + particles.randomness[i] * Math.PI) * 0.035;
    }

    positionAttr.needsUpdate = true;

    const mouseY = state?.mouse?.y ?? 0;
    const mouseX = state?.mouse?.x ?? 0;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, mouseY * 0.025, 0.03);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mouseX * 0.04, 0.03);
    materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, opacity, 0.08);
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.0075}
        color="#ffffff"
        transparent
        opacity={opacity}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

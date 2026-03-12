'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { Star } from '@/types';
import { getStarColor, getBaseScale } from '@/utils/starVisuals';
import { useStarStore } from '@/stores/useStarStore';
import { useCosmosStore } from '@/stores/useCosmosStore';

interface StarObjectProps {
  star: Star;
}

export function StarObject({ star }: StarObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);
  
  const setSelectedStarId = useStarStore((state) => state.setSelectedStarId);
  const setCameraTarget = useCosmosStore((state) => state.setCameraTarget);
  const setZoomLevel = useCosmosStore((state) => state.setZoomLevel);
  const setViewMode = useCosmosStore((state) => state.setViewMode);

  const baseColor = getStarColor(star.theme, star.status);
  const baseScale = getBaseScale(star.brightnessStage);
  
  // Visual tweaks based on status
  const isArchived = star.status === 'archived';
  const isDying = star.status === 'dying';
  
  const opacity = isArchived ? 0.3 : 1.0;
  const scale = isArchived ? baseScale * 0.5 : isDying ? baseScale * 0.8 : baseScale;
  const emissiveIntensity = isArchived ? 0.1 : isDying ? 0.5 : 2.0;

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.x += delta * 0.2;

      // Pulse effect directly on scale or emissive intensity based on state.clock
      if (!isArchived && materialRef.current) {
        const time = state.clock.getElapsedTime();
        const pulse = Math.sin(time * (isDying ? 5 : 2)) * 0.2 + 0.8;
        materialRef.current.emissiveIntensity = emissiveIntensity * pulse;
      }
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    setSelectedStarId(star.id);
    setCameraTarget(star.position);
    setZoomLevel(isArchived ? 6 : 4);
    setViewMode('detail');
  };

  return (
    <group position={star.position}>
      <Sphere 
        ref={meshRef}
        args={[0.2 * scale, 32, 32]} 
        onClick={handleClick}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <meshStandardMaterial 
          ref={materialRef}
          color={isDying ? '#aaaaaa' : baseColor} 
          emissive={baseColor}
          emissiveIntensity={emissiveIntensity}
          transparent={true}
          opacity={opacity}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
      
      {/* Glow / Halo Effect */}
      {!isArchived && (
        <Sphere args={[0.25 * scale, 16, 16]}>
          <meshBasicMaterial 
            color={baseColor} 
            transparent={true} 
            opacity={hovered ? 0.4 : 0.15} 
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </Sphere>
      )}
    </group>
  );
}

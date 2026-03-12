'use client';

import { useRef, useEffect } from 'react';
import { CameraControls } from '@react-three/drei';
import { useCosmosStore } from '@/stores/useCosmosStore';
import * as THREE from 'three';

export function CameraController() {
  const controlsRef = useRef<CameraControls>(null);
  const cameraTarget = useCosmosStore((state) => state.cameraTarget);
  const zoomLevel = useCosmosStore((state) => state.zoomLevel);

  useEffect(() => {
    if (controlsRef.current) {
      // Move camera smoothly to the target position
      // In explore mode, we keep a distance. In detail mode we move closer.
      
      const [tx, ty, tz] = cameraTarget;
      
      // Calculate a camera position slightly offset from the target based on zoomLevel
      const cx = tx;
      const cy = ty;
      const cz = tz + zoomLevel;

      controlsRef.current.setLookAt(cx, cy, cz, tx, ty, tz, true);
    }
  }, [cameraTarget, zoomLevel]);

  return (
    <CameraControls 
      ref={controlsRef} 
      makeDefault 
      minDistance={2} 
      maxDistance={30}
      dollySpeed={0.5}
      azimuthRotateSpeed={0.5}
      polarRotateSpeed={0.5}
      mouseButtons={{
        left: 1, // ACTION.ROTATE
        middle: 8, // ACTION.DOLLY
        right: 2, // ACTION.TRUCK
        wheel: 8, // ACTION.DOLLY
      }}
    />
  );
}

'use client';

import { Canvas } from '@react-three/fiber';
import { StarField } from './StarField';
import { CameraController } from './CameraController';
import { CosmosEnvironment } from './CosmosEnvironment';
import { StarObject } from './StarObject';
import { useStarStore } from '@/stores/useStarStore';

export function CosmosCanvas() {
  const stars = useStarStore((state) => state.stars);

  return (
    <Canvas
      className="w-full h-full bg-space-bg"
      camera={{ position: [0, 0, 15], fov: 45 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]} // Support retina displays safely
    >
      <color attach="background" args={['#030308']} />
      <ambientLight intensity={0.1} />
      
      <CosmosEnvironment />
      <StarField count={5000} />
      
      {stars.map((star) => (
        <StarObject key={star.id} star={star} />
      ))}
      
      <CameraController />
    </Canvas>
  );
}

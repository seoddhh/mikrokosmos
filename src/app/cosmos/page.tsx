'use client';

import { Suspense } from 'react';
import { CosmosCanvas } from '@/components/canvas/CosmosCanvas';
import { NavigationHUD } from '@/components/ui/NavigationHUD';
import { StarDetailPanel } from '@/components/ui/StarDetailPanel';
import { StarCreateModal } from '@/components/ui/StarCreateModal';
import { useCosmosStore } from '@/stores/useCosmosStore';

export default function CosmosPage() {
  const viewMode = useCosmosStore((state) => state.viewMode);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-space-bg">
      {/* 3D Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white">Loading Universe...</div>}>
          <CosmosCanvas />
        </Suspense>
      </div>

      {/* 2D Overlay UI Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Navigation HUD is always visible unless creating */}
        {viewMode !== 'create' && <NavigationHUD />}
        
        {/* Detail Panel slide in */}
        {viewMode === 'detail' && <StarDetailPanel />}
        
        {/* Create Flow Modal */}
        {viewMode === 'create' && <StarCreateModal />}
      </div>
    </main>
  );
}

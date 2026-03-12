'use client';

import { motion } from 'framer-motion';
import { useCosmosStore } from '@/stores/useCosmosStore';
import { useStarStore } from '@/stores/useStarStore';

export function NavigationHUD() {
  const setViewMode = useCosmosStore((state) => state.setViewMode);
  const viewMode = useCosmosStore((state) => state.viewMode);
  const stars = useStarStore((state) => state.stars);
  const setCameraTarget = useCosmosStore((state) => state.setCameraTarget);
  const setZoomLevel = useCosmosStore((state) => state.setZoomLevel);

  const activeCount = stars.filter(s => s.status !== 'archived').length;

  const handleCreateClick = () => {
    if (activeCount >= 5) {
      alert("별은 최대 5개까지만 생성할 수 있습니다.");
      return;
    }
    setViewMode('create');
  };

  const handleCenterClick = () => {
    setCameraTarget([0,0,0]);
    setZoomLevel(15);
    setViewMode('explore');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 1 }}
      className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between"
    >
      {/* Top Bar */}
      <div className="flex justify-between items-center w-full">
        <div className="text-white/80 font-light tracking-widest text-xl">
          Mikrokosmos
        </div>
        
        <div className="text-white/60 font-mono text-sm tracking-widest flex items-center gap-4">
          <span>Active Stars: {activeCount}/5</span>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex justify-between items-end w-full">
        {/* Left side: Context/Helper Actions */}
        <div className="flex gap-4 pointer-events-auto">
          {viewMode === 'detail' && (
            <button 
              onClick={handleCenterClick}
              className="px-4 py-2 rounded-full border border-white/20 bg-black/40 text-white/80 hover:bg-white/10 hover:text-white transition-all backdrop-blur-md text-sm tracking-wide"
            >
              ← 우주 보기
            </button>
          )}
        </div>

        {/* Right side: Primary Action */}
        <div className="pointer-events-auto">
          <button 
            onClick={handleCreateClick}
            disabled={activeCount >= 5}
            className="px-6 py-3 rounded-full bg-white/10 border border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all backdrop-blur-md font-light tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          >
            새로운 별 생성하기
          </button>
        </div>
      </div>
    </motion.div>
  );
}

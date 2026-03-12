'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStarStore } from '@/stores/useStarStore';
import { useCosmosStore } from '@/stores/useCosmosStore';

export function StarDetailPanel() {
  const selectedStarId = useStarStore((state) => state.selectedStarId);
  const stars = useStarStore((state) => state.stars);
  const addLog = useStarStore((state) => state.addLog);
  const archiveStar = useStarStore((state) => state.archiveStar);
  
  const setViewMode = useCosmosStore((state) => state.setViewMode);

  const [logInput, setLogInput] = useState('');

  const star = stars.find(s => s.id === selectedStarId);
  if (!star) return null;

  const handleClose = () => {
    setViewMode('explore');
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logInput.trim()) return;
    addLog(star.id, logInput);
    setLogInput('');
  };

  const handleArchive = () => {
    if (confirm("이 별을 흔적으로 남기시겠습니까? 삭제된 별은 초기 문장만 남고 더 이상 기록할 수 없습니다.")) {
      archiveStar(star.id);
      setViewMode('explore');
    }
  };

  const isArchived = star.status === 'archived';

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute top-0 right-0 h-full w-full sm:w-[500px] bg-black/80 backdrop-blur-xl border-l border-white/10 p-8 flex flex-col pointer-events-auto overflow-y-auto"
    >
      <div className="flex justify-between items-start mb-12">
        <div>
          <div className="text-white/50 font-mono text-sm tracking-widest mb-2">{star.catalogName}</div>
          <h2 className="text-4xl font-light tracking-wider text-white mb-2">{star.title}</h2>
          <div className="flex gap-2 text-xs tracking-widest">
            <span className="px-2 py-1 rounded-full border border-white/20 text-white/70 uppercase">
              {star.theme}
            </span>
            <span className={`px-2 py-1 rounded-full border uppercase ${isArchived ? 'border-red-500/50 text-red-400' : 'border-green-500/50 text-green-400'}`}>
              {star.status}
            </span>
            {!isArchived && (
              <span className="px-2 py-1 rounded-full border border-yellow-500/50 text-yellow-500/80 uppercase">
                {star.brightnessStage}
              </span>
            )}
          </div>
        </div>
        <button onClick={handleClose} className="text-white/50 hover:text-white p-2">✕</button>
      </div>

      <div className="flex-1 flex flex-col gap-8">
        {/* Initial Text Section */}
        <section>
          <h3 className="text-white/40 text-sm tracking-widest mb-4 uppercase">첫 마음</h3>
          <p className="text-white/90 font-light leading-relaxed text-lg italic">
            "{star.initialText}"
          </p>
          <div className="text-white/30 text-xs mt-2">{star.createdAt.toLocaleDateString()}</div>
        </section>

        <hr className="border-white/10" />

        {/* Logs Section (Hidden if archived) */}
        {!isArchived ? (
          <>
            <section className="flex-1 flex flex-col">
              <h3 className="text-white/40 text-sm tracking-widest mb-4 uppercase">기록된 흔적들</h3>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                {star.logs.length === 0 ? (
                  <p className="text-white/30 font-light">아직 기록이 없습니다.</p>
                ) : (
                  star.logs.map((log) => (
                    <div key={log.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-white/50 before:rounded-full">
                      <p className="text-white/80 font-light leading-relaxed mb-1">{log.text}</p>
                      <div className="text-white/30 text-xs">{log.createdAt.toLocaleDateString()}</div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Input Form */}
            <form onSubmit={handleAddLog} className="mt-8 relative">
              <input
                type="text"
                placeholder="오늘의 흔적을 기록하세요..."
                value={logInput}
                onChange={(e) => setLogInput(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg py-4 pl-4 pr-12 text-white font-light focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all"
              />
              <button 
                type="submit" 
                disabled={!logInput.trim()}
                className="absolute right-3 top-3.5 px-3 py-1 bg-white text-black rounded text-sm disabled:opacity-50"
              >
                기록
              </button>
            </form>
            
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-end">
              <button onClick={handleArchive} className="text-white/30 hover:text-red-400 text-sm transition-colors">
                별 생명 다하기 (흔적으로 남기기)
              </button>
            </div>
          </>
        ) : (
          <section className="flex-1 flex flex-col items-center justify-center opacity-50">
            <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mb-4">
              ✨
            </div>
            <p className="text-white/60 font-light tracking-widest text-center leading-loose">
              이 별은 지난 여정을 마치고<br/>
              우주의 영원한 흔적이 되었습니다.
            </p>
            <div className="text-white/30 text-xs mt-4">
              종료일: {star.archivedAt?.toLocaleDateString()}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
}

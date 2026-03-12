'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarTheme } from '@/types';
import { useStarStore } from '@/stores/useStarStore';
import { useCosmosStore } from '@/stores/useCosmosStore';

const THEMES: { id: StarTheme; label: string; desc: string; color: string }[] = [
  { id: 'dream', label: '꿈', desc: '이루고 싶은 장기적인 미래', color: 'bg-yellow-400' },
  { id: 'goal', label: '목표', desc: '구체적으로 달성할 단기적 성취', color: 'bg-yellow-100' },
  { id: 'wish', label: '소원', desc: '내 힘만으로는 어려운 간절한 바람', color: 'bg-blue-400' },
  { id: 'hope', label: '바람', desc: '세상이나 타인을 향한 따뜻한 마음', color: 'bg-purple-400' },
];

export function StarCreateModal() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [theme, setTheme] = useState<StarTheme | null>(null);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  const createStar = useStarStore((state) => state.createStar);
  const setViewMode = useCosmosStore((state) => state.setViewMode);
  const setCameraTarget = useCosmosStore((state) => state.setCameraTarget);

  const handleNext = () => setStep((s) => (s + 1) as any);
  const handleCancel = () => setViewMode('explore');

  const handleCreate = () => {
    if (!theme || !title || !text) return;
    
    // Random position in the universe
    const r = 20 + Math.random() * 20;
    const t = 2 * Math.PI * Math.random();
    const p = Math.acos(2 * Math.random() - 1);
    const x = r * Math.sin(p) * Math.cos(t);
    const y = r * Math.sin(p) * Math.sin(t);
    const z = r * Math.cos(p);
    
    createStar(theme, title, text, [x, y, z]);
    setCameraTarget([x, y, z]);
    setViewMode('explore');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md pointer-events-auto">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl bg-[#0a0a14] border border-white/20 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
          <motion.div 
            className="h-full bg-white/80" 
            initial={{ width: '33%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <button onClick={handleCancel} className="absolute top-6 right-6 text-white/50 hover:text-white pb-2 pr-2">
          ✕
        </button>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-3xl font-light tracking-widest mb-2">어떤 별을 띄울까요?</h2>
              <p className="text-white/50 mb-8 font-light">당신의 마음 속 가장 가까운 테마를 선택해주세요.</p>
              
              <div className="grid grid-cols-2 gap-4">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`p-6 rounded-xl border flex flex-col items-start gap-4 transition-all ${
                      theme === t.id ? 'border-white bg-white/10' : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full ${t.color} shadow-[0_0_10px_currentColor]`} />
                    <div className="text-left">
                      <div className="text-lg tracking-widest mb-1">{t.label}</div>
                      <div className="text-sm text-white/50">{t.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button onClick={handleNext} disabled={!theme} className="px-6 py-2 bg-white text-black rounded-full disabled:opacity-50 tracking-widest">다음</button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-3xl font-light tracking-widest mb-2">별의 이름을 지어주세요.</h2>
              <p className="text-white/50 mb-8 font-light">이 별이 상징하는 핵심적인 한 마디를 적어주세요.</p>
              
              <input
                autoFocus
                type="text"
                placeholder="예: 마라톤 풀코스 완주"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 text-3xl font-light tracking-wide pb-4 focus:outline-none focus:border-white transition-colors"
              />

              <div className="mt-12 flex justify-between">
                <button onClick={() => setStep(1)} className="px-6 py-2 text-white/70 hover:text-white tracking-widest">이전</button>
                <button onClick={handleNext} disabled={!title.trim()} className="px-6 py-2 bg-white text-black rounded-full disabled:opacity-50 tracking-widest">다음</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-3xl font-light tracking-widest mb-2">별에 담을 첫 마음</h2>
              <p className="text-white/50 mb-8 font-light">우주에 띄우는 이 별의 첫 번째 흔적을 남겨주세요.</p>
              
              <textarea
                autoFocus
                placeholder="당신의 마음을 기록하세요..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-40 bg-white/5 border border-white/20 rounded-xl p-4 text-lg font-light tracking-wide resize-none focus:outline-none focus:border-white/50 transition-colors"
              />

              <div className="mt-8 flex justify-between items-center">
                <button onClick={() => setStep(2)} className="px-6 py-2 text-white/70 hover:text-white tracking-widest">이전</button>
                <button onClick={handleCreate} disabled={!text.trim()} className="px-8 py-3 bg-white text-black rounded-full disabled:opacity-50 tracking-widest hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  우주에 띄우기
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function LandingOverlay() {
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();

  const handleEnterSpace = () => {
    setIsVisible(false);
    setTimeout(() => {
      router.push('/cosmos');
    }, 1000); // Wait for fade out
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1 } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-center"
          >
            <h1 className="text-6xl md:text-8xl font-light tracking-widest text-white mb-6" style={{ fontFamily: 'var(--font-geist-sans)' }}>
              Mikrokosmos
            </h1>
            <p className="text-neutral-400 text-lg md:text-xl tracking-wide font-light mb-12" style={{ fontFamily: 'var(--font-geist-mono)' }}>
              꿈을 별로 만들고, 기록으로 빛나게 하며, 사라진 마음조차 흔적으로 남기는 우주
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05, textShadow: "0px 0px 8px rgb(255 255 255 / 0.8)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEnterSpace}
              className="px-8 py-3 rounded-full border border-white/20 text-white bg-white/5 hover:bg-white/10 transition-colors duration-300 font-light tracking-widest"
            >
              우주로 들어가기
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

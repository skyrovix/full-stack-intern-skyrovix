import React from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';

export const ScrollProgress = () => {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001
  });

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #087FC1 0%, #18C7E8 50%, #7342E2 100%)',
        boxShadow: '0 0 10px rgba(24, 199, 232, 0.5)'
      }}
    />
  );
};

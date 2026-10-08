import React, { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const SpotlightCard = ({
  children,
  className = '',
  spotlightColor = 'rgba(8, 127, 193, 0.08)',
  borderColor = 'rgba(24, 199, 232, 0.25)',
  hoverY = -6,
  onClick
}) => {
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  const handleMouseMove = (e) => {
    if (isTouchDevice || shouldReduceMotion) return;
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={shouldReduceMotion ? undefined : { y: hoverY }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Subtle mouse glow spotlight */}
      {!isTouchDevice && !shouldReduceMotion && (
        <div
          className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300 z-0"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(450px circle at ${mousePosition.x}px ${mousePosition.y}px, ${spotlightColor}, transparent 75%)`
          }}
        />
      )}

      {/* Subtle mouse border light accent */}
      {!isTouchDevice && !shouldReduceMotion && (
        <div
          className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300 z-0 border border-transparent"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(280px circle at ${mousePosition.x}px ${mousePosition.y}px, ${borderColor}, transparent 60%)`,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor'
          }}
        />
      )}

      {/* Card Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  );
};

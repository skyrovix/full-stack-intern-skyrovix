import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

export const MagneticButton = ({
  children,
  className = '',
  onClick,
  style = {},
  strength = 0.22,
  ...props
}) => {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (isTouchDevice || shouldReduceMotion) return;
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    x.set(distanceX * strength);
    y.set(distanceY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: isTouchDevice || shouldReduceMotion ? 0 : springX,
        y: isTouchDevice || shouldReduceMotion ? 0 : springY,
        display: 'inline-block'
      }}
      whileTap={{ scale: 0.97 }}
      className="relative"
    >
      <div
        onClick={onClick}
        className={className}
        style={style}
        {...props}
      >
        {children}
      </div>
    </motion.div>
  );
};

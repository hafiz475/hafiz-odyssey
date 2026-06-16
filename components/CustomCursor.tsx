'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverText, setHoverText] = useState('');
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 40, stiffness: 450, mass: 0.3 };
  const ringX = useSpring(cursorX, springConfig);
  const ringY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setVisible(true);
    document.body.classList.add('custom-cursor-active');

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);

    // Track links, buttons hover
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, [role="button"], input, select, textarea, .interactive-3d');
      
      if (interactive) {
        setIsHovering(true);
        const text = interactive.getAttribute('data-cursor-text') || '';
        setHoverText(text);
      } else {
        setIsHovering(false);
        setHoverText('');
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.classList.remove('custom-cursor-active');
    };
  }, [cursorX, cursorY]);

  if (!visible) return null;

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-cyber-blue pointer-events-none z-[9999] mix-blend-screen flex items-center justify-center"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovering ? (hoverText ? 90 : 56) : 32,
          height: isHovering ? (hoverText ? 90 : 56) : 32,
          backgroundColor: isHovering ? 'rgba(0, 240, 255, 0.05)' : 'rgba(0, 240, 255, 0)',
          borderColor: isHovering ? '#bd00ff' : '#00f0ff',
          boxShadow: isHovering ? '0 0 15px rgba(189, 0, 255, 0.3)' : 'none',
        }}
      >
        {hoverText && (
          <span className="text-[9px] font-display font-bold tracking-widest text-cyber-blue uppercase animate-pulse text-center px-1">
            {hoverText}
          </span>
        )}
      </motion.div>

      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-cyber-blue rounded-full pointer-events-none z-[9999] mix-blend-screen"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovering ? 0.6 : 1,
          backgroundColor: isHovering ? '#bd00ff' : '#00f0ff',
          boxShadow: isHovering 
            ? '0 0 10px #bd00ff, 0 0 20px #bd00ff'
            : '0 0 8px #00f0ff',
        }}
      />
    </>
  );
}

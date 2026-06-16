'use client';

import React, { Suspense, useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';

interface CanvasContainerProps {
  children: React.ReactNode;
  className?: string;
  cameraPosition?: [number, number, number];
  fov?: number;
}

export default function CanvasContainer({
  children,
  className = '',
  cameraPosition = [0, 0, 5],
  fov = 75,
}: CanvasContainerProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    setMounted(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.01 } // Trigger visibility checks early
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!mounted) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-[#030303]/40 backdrop-blur-md ${className}`}>
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-cyber-blue/30 border-t-cyber-blue rounded-full animate-spin" />
          <div className="absolute w-6 h-6 border border-cyber-purple/30 border-b-cyber-purple rounded-full animate-spin [animation-duration:1.5s]" />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`w-full h-full relative ${className}`}>
      {isInView ? (
        <Canvas
          camera={{ position: cameraPosition, fov: fov }}
          dpr={[1, 1.5]} // Optimized pixel ratio capped for performance
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </Canvas>
      ) : (
        <div className="w-full h-full bg-[#030303]/10" />
      )}
    </div>
  );
}

'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

interface CinematicLoaderProps {
  onComplete: () => void;
}

// Spherical coordinates (latitude, longitude) for simplified continental outlines
const CONTINENTS: Record<string, [number, number][]> = {
  northAmerica: [
    [70, -160], [75, -100], [80, -60], [70, -40], [60, -55],
    [50, -50], [40, -74], [25, -80], [9, -85], [16, -95],
    [20, -105], [30, -115], [48, -125], [60, -140], [65, -165], [70, -160]
  ],
  southAmerica: [
    [9, -80], [10, -62], [-5, -35], [-23, -43], [-55, -65],
    [-45, -74], [-15, -75], [-5, -80], [9, -80]
  ],
  africa: [
    [37, 11], [32, 32], [11, 49], [-34, 19], [-15, 12],
    [5, 10], [14, -17], [35, -6], [37, 11]
  ],
  eurasia: [
    [36, -5], [43, 9], [60, 5], [70, 20], [75, 60],
    [70, 100], [60, 160], [40, 140], [35, 120], [22, 114],
    [10, 105], [15, 96], [22, 90], [13, 80], [25, 65],
    [12, 44], [30, 32], [31, 35], [40, 26], [36, -5]
  ],
  australia: [
    [-11, 136], [-15, 145], [-35, 150], [-35, 117], [-21, 114], [-11, 136]
  ],
  greenland: [
    [80, -60], [82, -30], [70, -20], [60, -43], [65, -55], [80, -60]
  ]
};

// Convert spherical (latitude/longitude) to unit Cartesian (x, y, z)
function latLonToCartesian(lat: number, lon: number) {
  const radLat = (lat * Math.PI) / 180;
  const radLon = (lon * Math.PI) / 180;
  return {
    x: Math.cos(radLat) * Math.sin(radLon),
    y: Math.sin(radLat),
    z: Math.cos(radLat) * Math.cos(radLon),
  };
}

export default function CinematicLoader({ onComplete }: CinematicLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Setup auto-complete timing matching previous setup (4.6s)
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4600);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Pre-compile Cartesian continental coords to save CPU overhead
  const cartesianContinents = useMemo(() => {
    const result: Record<string, { x: number; y: number; z: number }[]> = {};
    for (const [key, paths] of Object.entries(CONTINENTS)) {
      result[key] = paths.map(([lat, lon]) => latLonToCartesian(lat, lon));
    }
    return result;
  }, []);

  // Set up 2D Canvas Globe Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;
    const speed = 0.015; // Slow premium rotation speed

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 80; // 160px diameter core globe

      rotation += speed;

      // 3D rotation math helper
      const rotateY = (x: number, z: number, angle: number) => {
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        return {
          x: x * cosA - z * sinA,
          z: x * sinA + z * cosA,
        };
      };

      // 1. Draw outer static boundary circles (whirl base)
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.06)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 8, 0, Math.PI * 2);
      ctx.stroke();

      // 2. Draw moving outer whirl lines
      ctx.lineWidth = 0.75;
      
      // Arc Whirl 1 (Neon Cyan)
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#00f0ff';
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 11, rotation * 1.2, rotation * 1.2 + Math.PI * 0.35);
      ctx.stroke();

      // Arc Whirl 2 (Neon Purple)
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#bd00ff';
      ctx.strokeStyle = 'rgba(189, 0, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 5, -rotation * 1.8, -rotation * 1.8 + Math.PI * 0.2);
      ctx.stroke();

      // 3. Draw Main Globe Border Sphere
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#00f0ff';
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // 4. Draw Latitudes Parallels
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
      ctx.lineWidth = 0.5;
      for (let lat = -60; lat <= 60; lat += 20) {
        const radLat = (lat * Math.PI) / 180;
        const latRadius = Math.cos(radLat);
        const latY = Math.sin(radLat);

        ctx.beginPath();
        let drawing = false;
        for (let lon = 0; lon <= 360; lon += 5) {
          const radLon = (lon * Math.PI) / 180;
          const x = latRadius * Math.sin(radLon);
          const z = latRadius * Math.cos(radLon);

          const rot = rotateY(x, z, rotation);
          if (rot.z > 0) {
            const px = centerX + rot.x * radius;
            const py = centerY - latY * radius;
            if (!drawing) {
              ctx.moveTo(px, py);
              drawing = true;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            drawing = false;
          }
        }
        ctx.stroke();
      }

      // 5. Draw Longitudes Meridians
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
      for (let lon = 0; lon < 360; lon += 30) {
        const radLon = (lon * Math.PI) / 180;

        ctx.beginPath();
        let drawing = false;
        for (let lat = -90; lat <= 90; lat += 5) {
          const radLat = (lat * Math.PI) / 180;
          const x = Math.cos(radLat) * Math.sin(radLon);
          const y = Math.sin(radLat);
          const z = Math.cos(radLat) * Math.cos(radLon);

          const rot = rotateY(x, z, rotation);
          if (rot.z > 0) {
            const px = centerX + rot.x * radius;
            const py = centerY - y * radius;
            if (!drawing) {
              ctx.moveTo(px, py);
              drawing = true;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            drawing = false;
          }
        }
        ctx.stroke();
      }

      // 6. Draw Continent Boundaries
      ctx.shadowBlur = 5;
      ctx.shadowColor = '#00f0ff';
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.85)';
      ctx.lineWidth = 0.75;
      for (const paths of Object.values(cartesianContinents)) {
        ctx.beginPath();
        let drawing = false;
        paths.forEach((p) => {
          const rot = rotateY(p.x, p.z, rotation);
          if (rot.z > 0) {
            const px = centerX + rot.x * radius;
            const py = centerY - p.y * radius;
            if (!drawing) {
              ctx.moveTo(px, py);
              drawing = true;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            drawing = false;
          }
        });
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [cartesianContinents]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.0, ease: "easeOut" }}
      className="fixed inset-0 bg-[#030303] z-[9999] overflow-hidden flex items-center justify-center"
    >
      {/* 200x200 centered container for the Globe canvas */}
      <div className="w-[200px] h-[200px] flex items-center justify-center relative">
        <canvas ref={canvasRef} width={200} height={200} className="w-[200px] h-[200px] block" />
      </div>
    </motion.div>
  );
}

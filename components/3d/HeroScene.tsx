'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

const SKILLS = [
  "MERN Stack", "Next.js", "React", "Node.js", 
  "Three.js", "FastAPI", "MongoDB", "Redux", 
  "TypeScript", "GSAP", "Socket.IO", "Redis", 
  "TailwindCSS", "PostgreSQL", "Git", "Python"
];

function MorphingAvatar() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 1500;

  // Generate sphere positions
  const [positions, originalPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const orig = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      // Face profile / human skull-like procedural bounds or sphere bounds
      const isFaceSide = Math.cos(theta) > -0.2 && Math.sin(phi) > 0.1;
      const r = (isFaceSide ? 1.3 : 1.6) + (Math.random() - 0.5) * 0.12;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 1.25; // slightly tall
      const z = r * Math.cos(phi);
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      
      orig[i * 3] = x;
      orig[i * 3 + 1] = y;
      orig[i * 3 + 2] = z;
    }
    return [pos, orig];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.attributes.position;
    
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const ox = originalPositions[idx];
      const oy = originalPositions[idx + 1];
      const oz = originalPositions[idx + 2];
      
      // Calculate complex wave displacements
      const dist = Math.sqrt(ox*ox + oy*oy + oz*oz);
      const wave = Math.sin(dist * 3.5 - time * 1.5) * 0.12 + 
                   Math.cos(oy * 2.0 + time * 1.0) * 0.08;
      
      // Update coordinates
      posAttr.setX(i, ox + (ox / dist) * wave);
      posAttr.setY(i, oy + (oy / dist) * wave);
      posAttr.setZ(i, oz + (oz / dist) * wave);
    }
    
    posAttr.needsUpdate = true;
    
    // Rotate scene based on clock
    pointsRef.current.rotation.y = time * 0.08;
    pointsRef.current.rotation.x = Math.sin(time * 0.05) * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00f0ff"
        size={0.038}
        sizeAttenuation
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function SkillNode({ word, index, total }: { word: string; index: number; total: number }) {
  const nodeRef = useRef<THREE.Group>(null);

  // Map to golden ratio spiral (Fibonacci Sphere)
  const [position] = useMemo(() => {
    const phi = Math.acos(1 - 2 * (index + 0.5) / total);
    const theta = Math.PI * (1 + Math.sqrt(5)) * index;
    const radius = 3.0;

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    return [new THREE.Vector3(x, y, z)];
  }, [index, total]);

  useFrame((state) => {
    if (!nodeRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Slow orbits
    const angle = time * 0.06;
    
    // Orbit rotation around Y and X axis
    const rotatedX = position.x * Math.cos(angle) - position.z * Math.sin(angle);
    const rotatedZ = position.x * Math.sin(angle) + position.z * Math.cos(angle);
    
    nodeRef.current.position.set(
      rotatedX,
      position.y + Math.sin(time + index) * 0.15, // slight breathing float
      rotatedZ
    );
  });

  return (
    <group ref={nodeRef}>
      <Html distanceFactor={7} center>
        <div className="glass-panel text-glow-blue select-none px-2.5 py-1 rounded-full text-[9px] md:text-xs font-display tracking-widest text-cyber-blue font-semibold border border-cyber-blue/30 backdrop-blur-sm hover:bg-cyber-blue hover:text-black hover:border-cyber-blue transition-all duration-300 transform hover:scale-110 whitespace-nowrap">
          {word}
        </div>
      </Html>
    </group>
  );
}

export default function HeroScene() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!lightRef.current) return;
    const { x, y } = state.pointer;
    
    // Smooth light coordinate updates based on pointer
    lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, x * 6, 0.1);
    lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, y * 6, 0.1);
  });

  return (
    <>
      {/* Background Starfield and Sparkles */}
      <Stars radius={80} depth={40} count={3500} factor={4} saturation={0.5} fade speed={1.2} />
      <Sparkles count={80} scale={8} size={1.2} speed={0.4} noise={0.3} color="#00f0ff" />
      <Sparkles count={50} scale={6} size={1.5} speed={0.3} noise={0.2} color="#bd00ff" />

      {/* Cinematic Lighting */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#00f0ff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.8} color="#bd00ff" />
      
      {/* Interactive Cursor Spotlight */}
      <pointLight 
        ref={lightRef} 
        position={[0, 0, 4]} 
        intensity={2.5} 
        distance={10} 
        color="#00f0ff" 
        decay={2.0}
      />

      {/* 3D Morphing Avatar */}
      <group position={[0, -0.2, 0]}>
        <MorphingAvatar />
      </group>

      {/* 3D Skills Orbit Sphere */}
      <group position={[0, 0, 0]}>
        {SKILLS.map((skill, index) => (
          <SkillNode 
            key={skill} 
            word={skill} 
            index={index} 
            total={SKILLS.length} 
          />
        ))}
      </group>
    </>
  );
}

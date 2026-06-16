'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Sparkles, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

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
      
      const isFaceSide = Math.cos(theta) > -0.2 && Math.sin(phi) > 0.1;
      const r = (isFaceSide ? 1.3 : 1.6) + (Math.random() - 0.5) * 0.12;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 1.25;
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
      
      const dist = Math.sqrt(ox*ox + oy*oy + oz*oz);
      const wave = Math.sin(dist * 3.5 - time * 1.5) * 0.12 + 
                   Math.cos(oy * 2.0 + time * 1.0) * 0.08;
      
      posAttr.setX(i, ox + (ox / dist) * wave);
      posAttr.setY(i, oy + (oy / dist) * wave);
      posAttr.setZ(i, oz + (oz / dist) * wave);
    }
    
    posAttr.needsUpdate = true;
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
    const angle = time * 0.06;
    
    const rotatedX = position.x * Math.cos(angle) - position.z * Math.sin(angle);
    const rotatedZ = position.x * Math.sin(angle) + position.z * Math.cos(angle);
    
    nodeRef.current.position.set(
      rotatedX,
      position.y + Math.sin(time + index) * 0.15,
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

function BackgroundAssets() {
  const bgMeshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!bgMeshRef.current) return;
    bgMeshRef.current.rotation.z = state.clock.getElapsedTime() * -0.01;
  });

  return (
    <mesh ref={bgMeshRef} rotation={[Math.PI / 2.5, 0, 0]} position={[0, 0, -10]}>
      <ringGeometry args={[12, 12.2, 64]} />
      <meshBasicMaterial color="#bd00ff" transparent opacity={0.05} side={THREE.DoubleSide} wireframe />
    </mesh>
  );
}

function ForegroundAssets() {
  const assetsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!assetsRef.current) return;
    const time = state.clock.getElapsedTime();
    
    assetsRef.current.children.forEach((child, idx) => {
      child.rotation.y = time * (0.05 + idx * 0.02);
      child.rotation.x = time * (0.03 + idx * 0.01);
      child.position.y += Math.sin(time + idx) * 0.001;
    });
  });

  return (
    <group ref={assetsRef}>
      {/* Floating Mechanical Ring Gears */}
      <mesh position={[-2.4, 1.4, 2.5]}>
        <torusGeometry args={[0.4, 0.012, 8, 32]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.2} wireframe />
      </mesh>
      <mesh position={[-2.4, 1.4, 2.5]}>
        <torusGeometry args={[0.3, 0.006, 6, 24]} />
        <meshBasicMaterial color="#bd00ff" transparent opacity={0.15} wireframe />
      </mesh>

      {/* Floating Wireframe Tech box */}
      <mesh position={[2.6, -1.2, 2.0]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshBasicMaterial color="#bd00ff" transparent opacity={0.15} wireframe />
      </mesh>

      {/* Floating HUD circular targeting reticle */}
      <mesh position={[2.0, 1.6, 2.8]}>
        <ringGeometry args={[0.12, 0.14, 32]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Floating crosshair vector lines */}
      <group position={[-1.8, -1.6, 2.2]}>
        <mesh>
          <boxGeometry args={[0.2, 0.006, 0.006]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.35} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.006, 0.2, 0.006]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.35} />
        </mesh>
      </group>
    </group>
  );
}

interface HeroSceneProps {
  isIntroPlaying?: boolean;
}

export default function HeroScene({ isIntroPlaying = false }: HeroSceneProps) {
  const { camera } = useThree();
  const bgRef = useRef<THREE.Group>(null);
  const midRef = useRef<THREE.Group>(null);
  const fgRef = useRef<THREE.Group>(null);
  const atmosRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // Set camera to initial zoom-out coordinates on component mount
  useEffect(() => {
    camera.position.set(-2, 1.5, 12);
  }, [camera]);

  // Execute GSAP camera travel and zoom intro on loader complete
  useEffect(() => {
    if (!isIntroPlaying) return;
    
    // Smooth cinematic zoom-in pan
    gsap.fromTo(camera.position, 
      { z: 12, x: -2, y: 1.5 },
      { z: 5, x: 0, y: 0, duration: 4.2, ease: "power3.out" }
    );
    
    // Scale up avatar core
    if (midRef.current) {
      gsap.fromTo(midRef.current.scale,
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 1, duration: 3.0, delay: 0.2, ease: "back.out(1.1)" }
      );
    }

    // Drift in foreground details
    if (fgRef.current) {
      gsap.fromTo(fgRef.current.scale,
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 1, duration: 3.5, delay: 0.5, ease: "power2.out" }
      );
    }
  }, [isIntroPlaying, camera]);

  useFrame((state) => {
    const { x, y } = state.pointer;
    const time = state.clock.getElapsedTime();

    // 1. Move pointer spotlight
    if (lightRef.current) {
      lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, x * 6, 0.1);
      lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, y * 6, 0.1);
    }

    // 2. Parallax: Offset layer coordinates independently based on pointer position
    // Background: Low multiplier (0.4x)
    if (bgRef.current) {
      bgRef.current.position.x = THREE.MathUtils.lerp(bgRef.current.position.x, x * 0.4, 0.05);
      bgRef.current.position.y = THREE.MathUtils.lerp(bgRef.current.position.y, y * 0.4, 0.05);
      bgRef.current.rotation.y = Math.sin(time * 0.02) * 0.04;
    }

    // Midground: Medium multiplier (1.0x)
    if (midRef.current) {
      midRef.current.position.x = THREE.MathUtils.lerp(midRef.current.position.x, x * 1.0, 0.05);
      midRef.current.position.y = THREE.MathUtils.lerp(midRef.current.position.y, y * 1.0, 0.05);
    }

    // Foreground: High stereoscopic parallax multiplier (-2.2x opposite drift)
    if (fgRef.current) {
      fgRef.current.position.x = THREE.MathUtils.lerp(fgRef.current.position.x, x * -2.2, 0.05);
      fgRef.current.position.y = THREE.MathUtils.lerp(fgRef.current.position.y, y * -2.2, 0.05);
    }

    // Atmospheric: Moderate multiplier (0.8x)
    if (atmosRef.current) {
      atmosRef.current.position.x = THREE.MathUtils.lerp(atmosRef.current.position.x, x * 0.8, 0.05);
      atmosRef.current.position.y = THREE.MathUtils.lerp(atmosRef.current.position.y, y * 0.8, 0.05);
      atmosRef.current.rotation.z = Math.cos(time * 0.04) * 0.06;
    }
  });

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#00f0ff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.8} color="#bd00ff" />
      
      <pointLight 
        ref={lightRef} 
        position={[0, 0, 4]} 
        intensity={2.5} 
        distance={10} 
        color="#00f0ff" 
        decay={2.0}
      />

      {/* LAYER 1: BACKGROUND */}
      <group ref={bgRef}>
        <Stars radius={80} depth={40} count={3500} factor={4} saturation={0.5} fade speed={1.2} />
        <BackgroundAssets />
      </group>

      {/* LAYER 2: ATMOSPHERIC EFFECTS */}
      <group ref={atmosRef}>
        <Sparkles count={80} scale={8} size={1.2} speed={0.4} noise={0.3} color="#00f0ff" />
        <Sparkles count={50} scale={6} size={1.5} speed={0.3} noise={0.2} color="#bd00ff" />
      </group>

      {/* LAYER 3: MIDGROUND (MAIN AVATAR & SKILLS) */}
      <group ref={midRef}>
        <group position={[0, -0.2, 0]}>
          <MorphingAvatar />
        </group>
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
      </group>

      {/* LAYER 4: FOREGROUND */}
      <group ref={fgRef}>
        <ForegroundAssets />
      </group>
    </>
  );
}


'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Html, Sparkles, Line, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface TechNode {
  name: string;
  color: string;
  radius: number;
  speed: number;
  angleOffset: number;
  tiltX: number;
  tiltZ: number;
}

const TECH_STACK: TechNode[] = [
  { name: "React", color: "#00f0ff", radius: 1.6, speed: 0.8, angleOffset: 0, tiltX: 0.2, tiltZ: 0.1 },
  { name: "Next.js", color: "#ffffff", radius: 2.1, speed: 0.6, angleOffset: 2, tiltX: -0.15, tiltZ: 0.2 },
  { name: "TypeScript", color: "#2f74c0", radius: 2.5, speed: 0.5, angleOffset: 4, tiltX: 0.3, tiltZ: -0.1 },
  { name: "Node.js", color: "#3fa037", radius: 2.9, speed: 0.45, angleOffset: 1, tiltX: -0.25, tiltZ: -0.15 },
  { name: "MongoDB", color: "#47a248", radius: 3.3, speed: 0.38, angleOffset: 3.5, tiltX: 0.1, tiltZ: 0.3 },
  { name: "Three.js", color: "#ff007f", radius: 3.7, speed: 0.32, angleOffset: 5, tiltX: -0.35, tiltZ: 0.25 },
  { name: "FastAPI", color: "#009688", radius: 4.1, speed: 0.28, angleOffset: 1.5, tiltX: 0.2, tiltZ: -0.3 },
  { name: "Socket.IO", color: "#010101", radius: 4.5, speed: 0.25, angleOffset: 3, tiltX: -0.15, tiltZ: -0.35 },
  { name: "Redis", color: "#d82c20", radius: 4.9, speed: 0.22, angleOffset: 5.5, tiltX: 0.4, tiltZ: 0.15 },
];

function OrbitRing({ radius, tiltX, tiltZ }: { radius: number; tiltX: number; tiltZ: number }) {
  // Generate points for a clean 3D circular line
  const points = useMemo(() => {
    const pts = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(radius * Math.cos(theta), 0, radius * Math.sin(theta)));
    }
    return pts;
  }, [radius]);

  return (
    <group rotation={[tiltX, 0, tiltZ]}>
      <Line
        points={points}
        color="#ffffff"
        lineWidth={0.5}
        opacity={0.06}
        transparent
      />
    </group>
  );
}

function TechPlanet({ tech }: { tech: TechNode }) {
  const planetRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!planetRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Orbital math
    const currentAngle = time * tech.speed + tech.angleOffset;
    
    // Calculate coordinates in the local orbit plane
    const localX = tech.radius * Math.cos(currentAngle);
    const localZ = tech.radius * Math.sin(currentAngle);
    
    // Create vector and apply the tilts manually
    const position = new THREE.Vector3(localX, 0, localZ);
    
    // Apply rotations equivalent to tiltX and tiltZ
    position.applyAxisAngle(new THREE.Vector3(1, 0, 0), tech.tiltX);
    position.applyAxisAngle(new THREE.Vector3(0, 0, 1), tech.tiltZ);

    planetRef.current.position.copy(position);
  });

  return (
    <group ref={planetRef}>
      {/* Small tech sphere */}
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial 
          color={tech.color} 
          emissive={tech.color} 
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      
      {/* Orbital glow spark */}
      <Sparkles count={3} scale={0.4} size={1.5} color={tech.color} />

      {/* Futuristic Label */}
      <Html distanceFactor={8} center>
        <div 
          className="glass-panel text-[10px] font-display font-medium px-2 py-0.5 rounded border select-none transition-all duration-300 hover:scale-115 cursor-default hover:bg-white hover:text-black whitespace-nowrap"
          style={{ 
            borderColor: `${tech.color}35`, 
            boxShadow: `0 0 10px ${tech.color}15`,
            color: tech.color === "#ffffff" ? "#f5f5f7" : tech.color
          }}
        >
          {tech.name}
        </div>
      </Html>
    </group>
  );
}

export default function SkillsGalaxyScene() {
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (coreRef.current) {
      // Core spins slowly
      coreRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <>
      {/* Galaxy Core - Plasma Star */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.75, 64, 64]} />
        <MeshDistortMaterial
          color="#bd00ff"
          emissive="#670099"
          emissiveIntensity={1.5}
          distort={0.4}
          speed={2.2}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Orbit paths and orbiting nodes */}
      {TECH_STACK.map((tech) => (
        <React.Fragment key={tech.name}>
          <OrbitRing 
            radius={tech.radius} 
            tiltX={tech.tiltX} 
            tiltZ={tech.tiltZ} 
          />
          <TechPlanet tech={tech} />
        </React.Fragment>
      ))}

      {/* Nebular background dust */}
      <Stars radius={60} depth={20} count={1200} factor={3} saturation={0.5} fade speed={1.0} />
      <Sparkles count={50} scale={6} size={1} speed={0.3} noise={0.2} color="#bd00ff" />
      <Sparkles count={40} scale={8} size={1.2} speed={0.4} noise={0.1} color="#00f0ff" />
      
      {/* Lighting setup */}
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={4.0} distance={12} color="#bd00ff" decay={1.5} />
      <pointLight position={[0, 0, 0]} intensity={2.0} distance={8} color="#00f0ff" decay={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#00f0ff" />
    </>
  );
}

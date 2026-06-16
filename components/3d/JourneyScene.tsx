'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface JourneySceneProps {
  scrollProgress: number; // 0 to 1
}

const MILESTONES = [
  {
    title: "Mechanical Engineering",
    description: "B.Sc in Mechanical Engineering. Strong foundation in physics, mathematics, thermal systems, and analytical problem-solving.",
    date: "2016 - 2020",
    color: "#8888aa",
    positionT: 0.15,
  },
  {
    title: "Frontend Developer",
    description: "Transitioned to software. Mastered HTML/CSS, JS, React, and built high-performance responsive web applications.",
    date: "2020 - 2022",
    color: "#00f0ff",
    positionT: 0.45,
  },
  {
    title: "Senior Product Engineer",
    description: "Architecting enterprise SaaS at BizMagnets. Specializing in Node, MongoDB, Next.js 16, performance tunings, and real-time systems.",
    date: "2022 - Present",
    color: "#bd00ff",
    positionT: 0.75,
  },
  {
    title: "Founder @ Direction7",
    description: "Building the next generation of business solutions and AI-driven products. Driving technology and product strategy.",
    date: "2024 - Active",
    color: "#ffaa00",
    positionT: 0.95,
  }
];

export default function JourneyScene({ scrollProgress }: JourneySceneProps) {
  const tunnelRef = useRef<THREE.Mesh>(null);
  
  // Define spline curve for the tunnel
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 15),
      new THREE.Vector3(0, 0, 8),
      new THREE.Vector3(2, 0.5, 0),
      new THREE.Vector3(-2, -0.5, -8),
      new THREE.Vector3(0, 0, -16),
      new THREE.Vector3(0, 0, -24),
    ]);
  }, []);

  // Compute milestones 3D position along the curve
  const milestoneNodes = useMemo(() => {
    return MILESTONES.map((milestone) => {
      const pos = curve.getPointAt(milestone.positionT);
      // Offset slightly from the center to hover along the tunnel wall
      const offsetDirection = new THREE.Vector3(
        milestone.positionT > 0.5 ? -1.0 : 1.0,
        milestone.positionT % 0.2 > 0.1 ? 0.6 : -0.6,
        0
      ).normalize();
      
      const nodePos = pos.clone().add(offsetDirection.multiplyScalar(0.95));
      return {
        ...milestone,
        position: nodePos,
      };
    });
  }, [curve]);

  // Generate particles along the tunnel walls
  const particlePositions = useMemo(() => {
    const count = 600;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = Math.random();
      const p = curve.getPointAt(t);
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.8 + Math.random() * 0.4;
      
      // Calculate normal / binormal plane offsets
      const normal = curve.getTangentAt(t).cross(new THREE.Vector3(0, 1, 0)).normalize();
      const binormal = curve.getTangentAt(t).cross(normal).normalize();
      
      const offset = normal.multiplyScalar(Math.cos(angle) * radius)
        .add(binormal.multiplyScalar(Math.sin(angle) * radius));
      
      const point = p.add(offset);
      pos[i * 3] = point.x;
      pos[i * 3 + 1] = point.y;
      pos[i * 3 + 2] = point.z;
    }
    return pos;
  }, [curve]);

  useFrame((state) => {
    // Scroll progress maps to camera progression along spline
    // We cap it slightly so camera doesn't fly off the end
    const clampedProgress = Math.max(0.001, Math.min(scrollProgress, 0.999));
    
    // Get camera target position on curve
    const cameraPos = curve.getPointAt(clampedProgress);
    
    // Lerp camera position for buttery-smooth movements
    state.camera.position.lerp(cameraPos, 0.08);
    
    // Look at target further down the curve
    const lookAtPos = curve.getPointAt(Math.min(clampedProgress + 0.06, 1.0));
    state.camera.lookAt(lookAtPos);
    
    // Rotate tunnel mesh slowly to create moving illusion
    if (tunnelRef.current) {
      tunnelRef.current.rotation.z = state.clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} color="#00f0ff" />
      <directionalLight position={[-5, -5, -5]} intensity={0.7} color="#bd00ff" />
      
      {/* Dynamic light at camera position */}
      <pointLight position={[0, 0, 0]} intensity={1.5} distance={10} color="#00f0ff" />

      {/* Sparks floating along the path */}
      <Sparkles count={40} scale={15} size={1.2} speed={0.5} noise={0.2} color="#00f0ff" />
      <Sparkles count={30} scale={12} size={1.5} speed={0.4} noise={0.3} color="#bd00ff" />

      {/* Main Spline Wireframe Tunnel */}
      <mesh ref={tunnelRef}>
        <tubeGeometry args={[curve, 120, 2.2, 12, false]} />
        <meshBasicMaterial 
          color="#00f0ff" 
          wireframe 
          transparent 
          opacity={0.08} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Second outer glowing tunnel rings */}
      <mesh>
        <tubeGeometry args={[curve, 40, 2.5, 6, false]} />
        <meshBasicMaterial 
          color="#bd00ff" 
          wireframe 
          transparent 
          opacity={0.03} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Particles forming the tunnel walls */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#00f0ff"
          size={0.04}
          sizeAttenuation
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Milestone Nodes */}
      {milestoneNodes.map((milestone, idx) => (
        <group key={milestone.title} position={milestone.position}>
          {/* Milestone Geometry Anchor */}
          <mesh>
            {idx === 0 ? (
              // Mechanical: Torus Knot
              <torusKnotGeometry args={[0.22, 0.06, 48, 6, 2, 3]} />
            ) : idx === 1 ? (
              // Frontend: Box wireframe
              <boxGeometry args={[0.3, 0.3, 0.3]} />
            ) : idx === 2 ? (
              // Product Engineer: Icosahedron
              <icosahedronGeometry args={[0.26]} />
            ) : (
              // Founder: Star/Cone
              <coneGeometry args={[0.24, 0.4, 5]} />
            )}
            <meshStandardMaterial 
              color={milestone.color} 
              emissive={milestone.color} 
              emissiveIntensity={0.6}
              metalness={0.9} 
              roughness={0.1}
              wireframe={idx === 1}
            />
          </mesh>

          {/* Small orbital particle around milestone */}
          <Sparkles count={5} scale={0.8} size={2} color={milestone.color} />

          {/* Holographic Text Details */}
          <Html distanceFactor={6} center>
            <div className="glass-panel p-4 rounded-xl border border-white/10 backdrop-blur-md w-[220px] md:w-[280px] shadow-2xl relative select-none group pointer-events-none">
              <div 
                className="absolute top-0 left-4 h-[2px] w-12" 
                style={{ backgroundColor: milestone.color, boxShadow: `0 0 10px ${milestone.color}` }}
              />
              <span className="text-[10px] uppercase tracking-wider font-semibold font-display" style={{ color: milestone.color }}>
                {milestone.date}
              </span>
              <h3 className="text-sm md:text-base font-display font-bold text-white mt-0.5 tracking-wide">
                {milestone.title}
              </h3>
              <p className="text-[11px] md:text-xs text-zinc-400 mt-1.5 leading-relaxed font-light font-sans">
                {milestone.description}
              </p>
            </div>
          </Html>
        </group>
      ))}
    </>
  );
}

'use client';

import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Sparkles, Line, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface CityNode {
  id: string;
  name: string;
  desc: string;
  gridPos: [number, number]; // X, Z
  height: number;
  color: string;
}

const CITY_NODES: CityNode[] = [
  { id: "core", name: "Direction7 Core", desc: "Enterprise SaaS platform orchestrating client communications, business automation, and growth vectors.", gridPos: [0, 0], height: 2.2, color: "#ffaa00" },
  { id: "crm", name: "Dynamic CRM Portal", desc: "Omnichannel customer relationship manager streamlining leads, logs, and conversions.", gridPos: [-1.4, -1.2], height: 1.4, color: "#00f0ff" },
  { id: "marketing", name: "Marketing Automation Engine", desc: "Drip campaign scheduler, email relays, and pixel tracker operating autonomously.", gridPos: [1.6, -1.0], height: 1.1, color: "#bd00ff" },
  { id: "ops", name: "Ops Command Console", desc: "Business operations dashboard regulating analytics, pipelines, and logistics.", gridPos: [-1.5, 1.4], height: 1.3, color: "#ff007f" },
  { id: "ai", name: "D7 Predictive AI Insights", desc: "Algorithmic forecasting and data pattern compiler parsing client trends.", gridPos: [1.3, 1.5], height: 1.6, color: "#00ff66" },
];

interface FounderLabSceneProps {
  onSelectNode: (node: { name: string; desc: string; color: string } | null) => void;
}

function CityBuilding({ node, isSelected, onClick }: { node: CityNode; isSelected: boolean; onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Custom slow wiggling animation for hologram effect
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    if (isSelected) {
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1.15, 0.1);
    } else {
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1.0, 0.1);
    }
  });

  const position: [number, number, number] = [node.gridPos[0], node.height / 2 - 0.8, node.gridPos[1]];

  return (
    <group position={position}>
      {/* Solid glow base */}
      <mesh ref={meshRef} onClick={(e) => { e.stopPropagation(); onClick(); }}>
        <boxGeometry args={[0.6, node.height, 0.6]} />
        <meshStandardMaterial 
          color={node.color} 
          emissive={node.color}
          emissiveIntensity={isSelected ? 0.9 : 0.35}
          transparent
          opacity={0.8}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Hologram wireframe overlay */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.62, node.height * 1.01, 0.62]} />
        <meshBasicMaterial 
          color={node.color} 
          wireframe 
          transparent 
          opacity={isSelected ? 0.8 : 0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Building label */}
      <Html distanceFactor={7} position={[0, node.height / 2 + 0.2, 0]} center>
        <div 
          onClick={onClick}
          className={`px-2 py-0.5 rounded text-[8px] font-display uppercase tracking-widest border font-semibold select-none cursor-pointer transition-all duration-300 ${
            isSelected 
              ? 'bg-white text-black font-bold scale-105' 
              : 'glass-panel text-white border-white/20 hover:border-white/60'
          }`}
          style={{ borderColor: isSelected ? node.color : undefined }}
        >
          {node.name.split(" ")[0]}
        </div>
      </Html>
    </group>
  );
}

export default function FounderLabScene({ onSelectNode }: FounderLabSceneProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const cityGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (cityGroupRef.current) {
      const time = state.clock.getElapsedTime();
      // Floating motion
      cityGroupRef.current.position.y = Math.sin(time * 0.4) * 0.15;
      // Very slow orbit rotation
      cityGroupRef.current.rotation.y = time * 0.03;
    }
  });

  const handleSelect = (node: CityNode) => {
    if (selectedId === node.id) {
      setSelectedId(null);
      onSelectNode(null);
    } else {
      setSelectedId(node.id);
      onSelectNode({ name: node.name, desc: node.desc, color: node.color });
    }
  };

  // Compute lines between core and satellite structures
  const connections = useMemo(() => {
    const coreNode = CITY_NODES.find(n => n.id === "core")!;
    return CITY_NODES.filter(n => n.id !== "core").map(node => {
      const coreY = coreNode.height - 0.8;
      const nodeY = node.height - 0.8;
      return [
        new THREE.Vector3(coreNode.gridPos[0], coreY / 2, coreNode.gridPos[1]),
        new THREE.Vector3(node.gridPos[0], nodeY / 2, node.gridPos[1])
      ];
    });
  }, []);

  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[10, 8, 5]} intensity={1.5} color="#ffaa00" />
      <directionalLight position={[-8, -8, -5]} intensity={0.5} color="#00f0ff" />
      
      {/* Ground Grid projection */}
      <gridHelper args={[8, 16, "#ffaa00", "#332200"]} position={[0, -0.9, 0]}>
        <lineBasicMaterial attach="material" transparent opacity={0.3} />
      </gridHelper>

      <group ref={cityGroupRef}>
        {/* Connection Network Cables */}
        {connections.map((points, idx) => (
          <Line
            key={idx}
            points={points}
            color="#ffaa00"
            lineWidth={0.8}
            opacity={0.3}
            transparent
          />
        ))}

        {/* Building Structures */}
        {CITY_NODES.map((node) => (
          <CityBuilding
            key={node.id}
            node={node}
            isSelected={selectedId === node.id}
            onClick={() => handleSelect(node)}
          />
        ))}
      </group>

      {/* Galaxy backdrop particles */}
      <Stars radius={50} depth={20} count={800} factor={2} saturation={0.8} fade speed={0.8} />
      <Sparkles count={40} scale={6} size={1} speed={0.3} noise={0.2} color="#ffaa00" />
      <Sparkles count={20} scale={5} size={1.2} speed={0.2} noise={0.2} color="#00f0ff" />
    </>
  );
}

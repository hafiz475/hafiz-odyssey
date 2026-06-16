'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Stars, Line, Html } from '@react-three/drei';
import * as THREE from 'three';

interface NeuralNode {
  id: number;
  pos: THREE.Vector3;
  label?: string;
  size: number;
}

interface DataPacket {
  startIdx: number;
  endIdx: number;
  t: number;
  speed: number;
}

export default function AIZoneScene() {
  const groupRef = useRef<THREE.Group>(null);
  const packetsPointsRef = useRef<THREE.Points>(null);

  // Generate fixed neural network nodes
  const nodes = useMemo(() => {
    const list: NeuralNode[] = [
      { id: 0, pos: new THREE.Vector3(0, 0, 0), label: "AI Vector Engine", size: 0.18 },
      { id: 1, pos: new THREE.Vector3(-1.2, 0.8, -0.5), label: "Resume Parser (NLP)", size: 0.12 },
      { id: 2, pos: new THREE.Vector3(1.4, -0.6, 0.8), label: "Skill Embedder", size: 0.12 },
      { id: 3, pos: new THREE.Vector3(-0.8, -1.0, 1.2), label: "Job Indexer", size: 0.1 },
      { id: 4, pos: new THREE.Vector3(0.8, 1.2, -1.0), label: "Semantic Scorer", size: 0.14 },
      { id: 5, pos: new THREE.Vector3(-2.0, 0.0, 0.5), size: 0.08 },
      { id: 6, pos: new THREE.Vector3(2.2, 0.4, -0.6), size: 0.08 },
      { id: 7, pos: new THREE.Vector3(-0.5, 1.8, 0.6), size: 0.07 },
      { id: 8, pos: new THREE.Vector3(0.5, -1.6, -0.4), size: 0.07 },
      { id: 9, pos: new THREE.Vector3(1.8, -1.4, -1.2), size: 0.06 },
      { id: 10, pos: new THREE.Vector3(-1.6, -1.4, -0.8), size: 0.06 },
      { id: 11, pos: new THREE.Vector3(2.0, 1.5, 0.8), size: 0.07 },
    ];
    return list;
  }, []);

  // Compute links/synapses between nearby nodes
  const connections = useMemo(() => {
    const list: [number, number][] = [];
    const maxDistance = 2.2;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].pos.distanceTo(nodes[j].pos) < maxDistance) {
          list.push([i, j]);
        }
      }
    }
    return list;
  }, [nodes]);

  // Set up data packets flowing along synapses
  const packets = useMemo(() => {
    const list: DataPacket[] = [];
    const packetCount = 12;
    for (let i = 0; i < packetCount; i++) {
      // Pick a random connection to start
      const connIdx = Math.floor(Math.random() * connections.length);
      const conn = connections[connIdx];
      list.push({
        startIdx: conn[0],
        endIdx: conn[1],
        t: Math.random(), // random initial progress
        speed: 0.006 + Math.random() * 0.008,
      });
    }
    return list;
  }, [connections]);

  const packetPositions = useMemo(() => {
    return new Float32Array(packets.length * 3);
  }, [packets]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Slowly rotate the neural net group
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.05;
      groupRef.current.rotation.z = Math.sin(time * 0.03) * 0.08;
    }

    // Update data packets along connections
    if (packetsPointsRef.current) {
      const posAttr = packetsPointsRef.current.geometry.attributes.position;
      
      packets.forEach((packet, i) => {
        // Increment progress
        packet.t += packet.speed;
        if (packet.t >= 1.0) {
          // Reset packet along a random connection
          packet.t = 0;
          const connIdx = Math.floor(Math.random() * connections.length);
          const conn = connections[connIdx];
          // Randomize direction
          if (Math.random() > 0.5) {
            packet.startIdx = conn[0];
            packet.endIdx = conn[1];
          } else {
            packet.startIdx = conn[1];
            packet.endIdx = conn[0];
          }
          packet.speed = 0.006 + Math.random() * 0.008;
        }

        const startNode = nodes[packet.startIdx].pos;
        const endNode = nodes[packet.endIdx].pos;
        
        // Lerp position based on t
        const currentPos = new THREE.Vector3().lerpVectors(startNode, endNode, packet.t);
        
        posAttr.setX(i, currentPos.x);
        posAttr.setY(i, currentPos.y);
        posAttr.setZ(i, currentPos.z);
      });
      
      posAttr.needsUpdate = true;
    }
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} color="#00ff66" />
      <directionalLight position={[-5, -5, -5]} intensity={0.8} color="#00f0ff" />
      
      {/* Light glow at core */}
      <pointLight position={[0, 0, 0]} intensity={2.0} distance={8} color="#00ff66" decay={1.5} />

      {/* Galaxy backdrop particles */}
      <Stars radius={50} depth={20} count={600} factor={2} saturation={0.8} fade speed={0.8} />
      <Sparkles count={40} scale={6} size={1} speed={0.3} noise={0.2} color="#00ff66" />
      <Sparkles count={30} scale={5} size={1.2} speed={0.2} noise={0.2} color="#00f0ff" />

      <group ref={groupRef}>
        {/* Connection Lines (Synapses) */}
        {connections.map(([i, j], idx) => (
          <Line
            key={idx}
            points={[nodes[i].pos, nodes[j].pos]}
            color="#00f0ff"
            lineWidth={0.5}
            opacity={0.15}
            transparent
          />
        ))}

        {/* Neural Nodes (Spheres) */}
        {nodes.map((node) => (
          <group key={node.id} position={node.pos}>
            <mesh>
              <sphereGeometry args={[node.size, 16, 16]} />
              <meshStandardMaterial 
                color={node.label ? "#00ff66" : "#00f0ff"} 
                emissive={node.label ? "#00ff66" : "#00f0ff"}
                emissiveIntensity={0.6}
                roughness={0.1}
                metalness={0.9}
              />
            </mesh>

            {/* Pulsating sparks around labelled nodes */}
            {node.label && (
              <Sparkles count={4} scale={0.4} size={2} color="#00ff66" />
            )}

            {/* Node HTML Labels */}
            {node.label && (
              <Html distanceFactor={6} position={[0, node.size + 0.15, 0]} center>
                <div 
                  className="glass-panel text-[8px] md:text-[10px] font-display font-medium px-2 py-0.5 rounded border border-green-500/30 text-green-400 select-none whitespace-nowrap shadow-md shadow-green-500/5"
                  style={{ textShadow: "0 0 5px rgba(0,255,102,0.4)" }}
                >
                  {node.label}
                </div>
              </Html>
            )}
          </group>
        ))}

        {/* Data Packets (Points traveling on synapses) */}
        <points ref={packetsPointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[packetPositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#00ff66"
            size={0.075}
            sizeAttenuation
            transparent
            opacity={0.95}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      </group>
    </>
  );
}

"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function GlowingSphere() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.1;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  return (
    <mesh ref={mesh} scale={1.6}>
      <icosahedronGeometry args={[1, 2]} />
      <meshStandardMaterial
        color="#7c3aed"
        emissive="#7c3aed"
        emissiveIntensity={0.4}
        metalness={0.9}
        roughness={0.15}
        wireframe
      />
    </mesh>
  );
}

function InnerGlow() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.08;
    mesh.current.rotation.y = state.clock.elapsedTime * -0.12;
    const scale = 1.1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    mesh.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1.2, 32, 32]} />
      <meshStandardMaterial
        color="#a78bfa"
        emissive="#a78bfa"
        emissiveIntensity={0.6}
        transparent
        opacity={0.12}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

function OrbitRing({ radius, speed, tilt, opacity }: { radius: number; speed: number; tilt: number; opacity: number }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.z = state.clock.elapsedTime * speed;
  });

  return (
    <mesh ref={mesh} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.008, 16, 100]} />
      <meshBasicMaterial color="#a78bfa" transparent opacity={opacity} />
    </mesh>
  );
}

function Particles({ count = 120 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Distribute in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.5 + Math.random() * 2.5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      sz[i] = Math.random() * 0.03 + 0.01;
    }
    return { positions: pos, sizes: sz };
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.03;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#c4b5fd"
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function FloatingOrbs() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  const orbs = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const angle = (i / 6) * Math.PI * 2;
      const r = 2.2 + Math.random() * 0.5;
      return {
        position: [
          Math.cos(angle) * r,
          (Math.random() - 0.5) * 1.5,
          Math.sin(angle) * r,
        ] as [number, number, number],
        scale: 0.04 + Math.random() * 0.04,
        speed: 0.5 + Math.random() * 1.5,
      };
    });
  }, []);

  return (
    <group ref={group}>
      {orbs.map((orb, i) => (
        <FloatingOrb key={i} {...orb} index={i} />
      ))}
    </group>
  );
}

function FloatingOrb({ position, scale, speed, index }: { position: [number, number, number]; scale: number; speed: number; index: number }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed + index) * 0.3;
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial
        color="#c4b5fd"
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

export function HeroScene() {
  return (
    <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px]" data-default-cursor>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#a78bfa" />
        <directionalLight position={[-3, -3, 5]} intensity={0.5} color="#818cf8" />
        <pointLight position={[0, 0, 3]} intensity={1.5} color="#c4b5fd" distance={8} />
        <pointLight position={[2, -2, 2]} intensity={0.5} color="#7c3aed" distance={6} />

        <InnerGlow />
        <GlowingSphere />
        <OrbitRing radius={2.2} speed={0.08} tilt={Math.PI / 3} opacity={0.25} />
        <OrbitRing radius={2.6} speed={-0.05} tilt={-Math.PI / 5} opacity={0.15} />
        <OrbitRing radius={3.0} speed={0.03} tilt={Math.PI / 2.2} opacity={0.08} />
        <Particles />
        <FloatingOrbs />
      </Canvas>
    </div>
  );
}

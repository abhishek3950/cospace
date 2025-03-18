import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { useStore } from '../store/useStore';

interface DeskProps {
  position: [number, number, number];
  rotation: [number, number, number];
}

export const Desk = ({ position, rotation }: DeskProps) => {
  const deskRef = useRef<Mesh>(null);
  const { hoveredDesk, setHoveredDesk } = useStore();

  useFrame((state) => {
    if (deskRef.current) {
      // Add any desk animations or updates here
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Desk surface */}
      <mesh
        ref={deskRef}
        position={[0, 0.75, 0]}
        onPointerOver={() => setHoveredDesk(true)}
        onPointerOut={() => setHoveredDesk(false)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2, 0.05, 1]} />
        <meshStandardMaterial
          color={hoveredDesk ? '#e0e0e0' : '#d0d0d0'}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>

      {/* Desk legs */}
      {[-1, 1].map((x) => (
        <mesh
          key={x}
          position={[x, 0.375, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.1, 0.75, 0.1]} />
          <meshStandardMaterial color="#b0b0b0" />
        </mesh>
      ))}

      {/* Monitor */}
      <mesh
        position={[0, 1.5, -0.4]}
        rotation={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1.2, 0.7, 0.05]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Monitor stand */}
      <mesh
        position={[0, 1.15, -0.4]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.2, 0.7, 0.2]} />
        <meshStandardMaterial color="#808080" />
      </mesh>
    </group>
  );
}; 
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { useStore } from '../store/useStore';

interface CommonAreaProps {
  position: [number, number, number];
  rotation: [number, number, number];
}

export const CommonArea = ({ position, rotation }: CommonAreaProps) => {
  const areaRef = useRef<Mesh>(null);
  const { setCurrentRoom } = useStore();

  useFrame((state) => {
    if (areaRef.current) {
      // Add any area animations or updates here
    }
  });

  const handleAreaClick = () => {
    setCurrentRoom('common-area');
  };

  return (
    <group position={position} rotation={rotation}>
      {/* Area floor */}
      <mesh
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={handleAreaClick}
      >
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>

      {/* Sofa */}
      <mesh
        position={[-2, 0.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2, 1, 0.5]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>

      {/* Coffee table */}
      <mesh
        position={[0, 0.5, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 0.05, 1]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>

      {/* Table legs */}
      {[
        [-0.5, 0, -0.5],
        [0.5, 0, -0.5],
        [-0.5, 0, 0.5],
        [0.5, 0, 0.5],
      ].map((pos, index) => (
        <mesh
          key={index}
          position={pos as [number, number, number]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.1, 1, 0.1]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
      ))}

      {/* Plants */}
      {[
        [-3, 0, -2],
        [3, 0, -2],
        [-3, 0, 2],
        [3, 0, 2],
      ].map((pos, index) => (
        <group key={index} position={pos as [number, number, number]}>
          {/* Plant pot */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.4, 32]} />
            <meshStandardMaterial color="#8b4513" />
          </mesh>
          {/* Plant leaves */}
          <mesh position={[0, 0.4, 0]} castShadow>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#228B22" />
          </mesh>
        </group>
      ))}
    </group>
  );
}; 
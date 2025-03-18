import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { Desk } from '../components/Desk';
import { MeetingRoom } from '../components/MeetingRoom';
import { CommonArea } from '../components/CommonArea';

export const OfficeFloor = () => {
  const floorRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (floorRef.current) {
      // Add any floor animations or updates here
    }
  });

  return (
    <group>
      {/* Main floor */}
      <mesh
        ref={floorRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* Office elements */}
      <Desk position={[-5, 0, -5]} rotation={[0, Math.PI / 4, 0]} />
      <Desk position={[5, 0, -5]} rotation={[0, -Math.PI / 4, 0]} />
      <Desk position={[-5, 0, 5]} rotation={[0, Math.PI / 4, 0]} />
      <Desk position={[5, 0, 5]} rotation={[0, -Math.PI / 4, 0]} />

      {/* Meeting rooms */}
      <MeetingRoom position={[0, 0, -10]} rotation={[0, 0, 0]} />
      <MeetingRoom position={[-10, 0, 0]} rotation={[0, Math.PI / 2, 0]} />

      {/* Common areas */}
      <CommonArea position={[0, 0, 10]} rotation={[0, 0, 0]} />
    </group>
  );
}; 
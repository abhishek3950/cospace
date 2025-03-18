import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import { ThreeEvent } from '@react-three/fiber';
import { useStore } from '../store/useStore';

interface MeetingRoomProps {
  position: [number, number, number];
  rotation: [number, number, number];
  roomId: string;
  name?: string;
  capacity?: number;
}

export const MeetingRoom = ({ 
  position, 
  rotation, 
  roomId, 
  name = 'Meeting Room',
  capacity = 4 
}: MeetingRoomProps) => {
  const roomRef = useRef<Group>(null);
  const wallsRef = useRef<Mesh>(null);
  const { setCurrentRoom, currentRoom } = useStore();
  const [isHovered, setIsHovered] = useState(false);

  const isActive = currentRoom === roomId;

  useFrame((_state, _delta) => {
    if (wallsRef.current) {
      // Subtle breathing animation when room is active
      if (isActive) {
        wallsRef.current.scale.y = 1 + Math.sin(_state.clock.elapsedTime * 2) * 0.02;
      }
    }
  });

  const handleRoomClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setCurrentRoom(isActive ? null : roomId);
  };

  const handlePointerOver = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setIsHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setIsHovered(false);
    document.body.style.cursor = 'default';
  };

  return (
    <group ref={roomRef} position={position} rotation={rotation}>
      {/* Room walls */}
      <mesh
        ref={wallsRef}
        position={[0, 1.5, 0]}
        castShadow
        receiveShadow
        onClick={handleRoomClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[4, 3, 4]} />
        <meshStandardMaterial
          color={isActive ? "#e3f2fd" : isHovered ? "#f5f5f5" : "#ffffff"}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Room floor */}
      <mesh
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial 
          color={isActive ? "#bbdefb" : "#e0e0e0"} 
        />
      </mesh>

      {/* Conference table */}
      <mesh
        position={[0, 0.75, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2, 0.05, 1.5]} />
        <meshStandardMaterial 
          color="#8b4513"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Table legs */}
      {[
        [-1, 0, -0.75],
        [1, 0, -0.75],
        [-1, 0, 0.75],
        [1, 0, 0.75],
      ].map((pos, index) => (
        <mesh
          key={`table-leg-${index}`}
          position={pos as [number, number, number]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.1, 1.5, 0.1]} />
          <meshStandardMaterial 
            color="#8b4513"
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>
      ))}

      {/* Chairs */}
      {[
        [-1.5, 0, 0],
        [1.5, 0, 0],
        [0, 0, -1.5],
        [0, 0, 1.5],
      ].map((pos, index) => (
        <mesh
          key={`chair-${index}`}
          position={pos as [number, number, number]}
          rotation={[0, index * Math.PI / 2, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.5, 1, 0.5]} />
          <meshStandardMaterial 
            color="#8b4513"
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      ))}

      {/* Room label (if we add Text3D from drei later) */}
      {/* <Text
        position={[0, 3.2, 0]}
        fontSize={0.2}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text> */}
    </group>
  );
}; 
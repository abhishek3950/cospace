import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import { OfficeFloor } from './OfficeFloor';
import { LoadingScreen } from '../components/LoadingScreen';

export const VirtualOffice = () => {
  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{ position: [0, 2, 5], fov: 75 }}
        shadows
      >
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
          />
          <OfficeFloor />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={20}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
      <LoadingScreen />
    </div>
  );
}; 
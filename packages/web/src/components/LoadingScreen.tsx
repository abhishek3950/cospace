import { Suspense } from 'react';
import { useProgress } from '@react-three/drei';

export const LoadingScreen = () => {
  const { progress } = useProgress();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Loading Virtual Office</h2>
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-gray-600">
          {Math.round(progress)}% loaded
        </p>
      </div>
    </div>
  );
}; 
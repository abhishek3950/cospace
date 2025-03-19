import React, { useState, useEffect, useRef } from 'react';
import type { User } from '@cospace/shared';

interface MediaInteractionProps {
  user: User;
  type: 'video' | 'audio' | 'screen';
  onClose: () => void;
}

export const MediaInteraction: React.FC<MediaInteractionProps> = ({
  user,
  type,
  onClose,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const initializeMedia = async () => {
      try {
        if (type === 'video' || type === 'audio') {
          const constraints = {
            audio: true,
            video: type === 'video',
          };
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          localStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    initializeMedia();
    return () => {
      // Cleanup streams
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [type]);

  const handleToggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!isMuted);
      }
    }
  };

  const handleToggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!isVideoOff);
      }
    }
  };

  const handleToggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        screenStreamRef.current = screenStream;
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);
      } else {
        if (screenStreamRef.current) {
          screenStreamRef.current.getTracks().forEach(track => track.stop());
          screenStreamRef.current = null;
        }
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-[800px] h-[600px] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {type === 'video' ? 'Video Call' : type === 'audio' ? 'Audio Call' : 'Screen Share'} with {user.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 relative bg-gray-900 rounded-lg overflow-hidden">
          {/* Local Video */}
          {type === 'video' && (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="absolute bottom-4 right-4 w-48 h-36 object-cover rounded-lg"
            />
          )}

          {/* Remote Video */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Audio Visualization */}
          {type === 'audio' && (
            <div className="flex items-center justify-center h-full">
              <div className="text-white text-2xl">🎤</div>
            </div>
          )}
        </div>

        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={handleToggleMute}
            className={`p-3 rounded-full ${
              isMuted ? 'bg-red-500' : 'bg-blue-500'
            } text-white hover:opacity-90`}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>

          {type === 'video' && (
            <button
              onClick={handleToggleVideo}
              className={`p-3 rounded-full ${
                isVideoOff ? 'bg-red-500' : 'bg-blue-500'
              } text-white hover:opacity-90`}
            >
              {isVideoOff ? '📵' : '📹'}
            </button>
          )}

          {type === 'screen' && (
            <button
              onClick={handleToggleScreenShare}
              className={`p-3 rounded-full ${
                isScreenSharing ? 'bg-red-500' : 'bg-blue-500'
              } text-white hover:opacity-90`}
            >
              {isScreenSharing ? '🖥️' : '💻'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 
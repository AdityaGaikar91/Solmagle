import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

export const VideoRoom = () => {
  const { roomId } = useParams();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  useEffect(() => {
    const initializeVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    initializeVideo();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div className="relative">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full rounded-lg"
        />
        <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
          You
        </span>
      </div>
      <div className="relative">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full rounded-lg"
        />
        <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
          Match
        </span>
      </div>
    </div>
  );
};
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const useWebRTC = (roomId) => {
  const socketRef = useRef();
  const peerRef = useRef();
  const localStreamRef = useRef();
  const remoteStreamRef = useRef();

  useEffect(() => {
    socketRef.current = io(process.env.VITE_API_URL);
    
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        localStreamRef.current = stream;
        
        peerRef.current = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
          ]
        });

        stream.getTracks().forEach(track => {
          peerRef.current.addTrack(track, stream);
        });

        peerRef.current.ontrack = (event) => {
          remoteStreamRef.current = event.streams[0];
        };

        socketRef.current.emit('join-room', roomId);

        // Handle WebRTC signaling
        socketRef.current.on('offer', handleOffer);
        socketRef.current.on('answer', handleAnswer);
        socketRef.current.on('ice-candidate', handleIceCandidate);
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    initializeMedia();

    return () => {
      socketRef.current?.disconnect();
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      peerRef.current?.close();
    };
  }, [roomId]);

  return {
    localStream: localStreamRef.current,
    remoteStream: remoteStreamRef.current
  };
};
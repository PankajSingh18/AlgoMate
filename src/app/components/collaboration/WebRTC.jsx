// components/collaboration/WebRTC.jsx

'use client';

import { useState, useEffect, useRef } from 'react';
import SimplePeer from 'simple-peer';

export function WebRTC({ client, participants, currentUserId, sessionId }) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [peers, setPeers] = useState({});
  const localVideoRef = useRef(null);
  const remoteVideoRefs = useRef({});
  const peerInstances = useRef({});

  // Initialize WebRTC
  useEffect(() => {
    if (!client) return;

    // Handle WebRTC events from server
    client.on('webrtc-offer', handleWebRTCOffer);
    client.on('webrtc-answer', handleWebRTCAnswer);
    client.on('webrtc-ice-candidate', handleWebRTCICECandidate);

    return () => {
      // Clean up peers
      for (const peer of Object.values(peerInstances.current)) {
        peer.destroy();
      }
      peerInstances.current = {};
    };
  }, [client]);

  // Start WebRTC
  const startWebRTC = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setIsAudioEnabled(true);
      setIsVideoEnabled(true);

      // Create peer connections for all participants
      for (const participant of participants) {
        if (participant.id !== currentUserId) {
          createPeerConnection(stream, participant);
        }
      }
    } catch (error) {
      console.error('Failed to start WebRTC:', error);
    }
  };

  // Create peer connection
  const createPeerConnection = (stream, participant) => {
    const peer = new SimplePeer({
      initiator: true,
      trickle: true,
      stream,
    });

    peer.on('signal', (data) => {
      client.sendWebRTCOffer(participant.userId, data);
    });

    peer.on('stream', (remoteStream) => {
      if (remoteVideoRefs.current[participant.id]) {
        remoteVideoRefs.current[participant.id].srcObject = remoteStream;
      }
    });

    peer.on('error', (error) => {
      console.error('Peer error:', error);
    });

    peerInstances.current[participant.id] = peer;
    setPeers(prev => ({ ...prev, [participant.id]: peer }));
  };

  // Handle WebRTC offer
  const handleWebRTCOffer = (data) => {
    const { fromUserId, payload } = data;
    
    if (!peerInstances.current[fromUserId]) {
      const peer = new SimplePeer({
        initiator: false,
        trickle: true,
      });

      peer.on('signal', (signalData) => {
        client.sendWebRTCAnswer(fromUserId, signalData);
      });

      peer.on('stream', (stream) => {
        if (remoteVideoRefs.current[fromUserId]) {
          remoteVideoRefs.current[fromUserId].srcObject = stream;
        }
      });

      peer.signal(payload);
      peerInstances.current[fromUserId] = peer;
      setPeers(prev => ({ ...prev, [fromUserId]: peer }));
    }
  };

  // Handle WebRTC answer
  const handleWebRTCAnswer = (data) => {
    const { fromUserId, payload } = data;
    const peer = peerInstances.current[fromUserId];
    if (peer) {
      peer.signal(payload);
    }
  };

  // Handle ICE candidate
  const handleWebRTCICECandidate = (data) => {
    const { fromUserId, payload } = data;
    const peer = peerInstances.current[fromUserId];
    if (peer) {
      peer.signal(payload);
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const tracks = localVideoRef.current.srcObject.getAudioTracks();
      for (const track of tracks) {
        track.enabled = !track.enabled;
      }
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const tracks = localVideoRef.current.srcObject.getVideoTracks();
      for (const track of tracks) {
        track.enabled = !track.enabled;
      }
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Local video (small) */}
      <div className="bg-black rounded-lg overflow-hidden shadow-lg">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-48 h-36 object-cover"
        />
        <div className="absolute bottom-2 left-2 flex space-x-1">
          <button
            onClick={toggleAudio}
            className={`p-1 rounded ${isAudioEnabled ? 'bg-green-500' : 'bg-red-500'} text-white`}
          >
            {isAudioEnabled ? '🎤' : '🔇'}
          </button>
          <button
            onClick={toggleVideo}
            className={`p-1 rounded ${isVideoEnabled ? 'bg-green-500' : 'bg-red-500'} text-white`}
          >
            {isVideoEnabled ? '📹' : '🚫'}
          </button>
          <button
            onClick={startWebRTC}
            className="p-1 rounded bg-blue-500 text-white"
          >
            🔗 Connect
          </button>
        </div>
      </div>

      {/* Remote videos */}
      {Object.entries(peers).map(([participantId, peer]) => (
        <div key={participantId} className="mt-2 bg-black rounded-lg overflow-hidden shadow-lg">
          <video
            ref={(el) => { remoteVideoRefs.current[participantId] = el; }}
            autoPlay
            playsInline
            className="w-48 h-36 object-cover"
          />
          <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
            {participants.find(p => p.id === participantId)?.name || 'Participant'}
          </div>
        </div>
      ))}
    </div>
  );
}
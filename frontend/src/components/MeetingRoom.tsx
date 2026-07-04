import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

interface MeetingRoomProps {
  roomCode: string;
  onLeave: () => void;
}

// Global socket cluster reference node
const socket = io('https://intellmeet-enterprise-platform.onrender.com');

export default function MeetingRoom({ roomCode, onLeave }: MeetingRoomProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [peerConnected, setPeerConnected] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const userStream = useRef<MediaStream | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    // 1. Local Hardware Access Init
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userStream.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        // Backend room mesh context inform karna
        socket.emit('join-room', { roomCode, userId: socket.id });

        // Initialize WebRTC Component
        initWebRTC(stream);
      })
      .catch(err => console.error("Hardware pipeline failed:", err));

    // 2. Socket Event Listeners for P2P connection
    socket.on('peer-joined', async ({ userId }) => {
      setPeerConnected(true);
      if (peerConnection.current && userStream.current) {
        // Create WebRTC Offer
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        socket.emit('signal', { to: userId, signal: offer });
      }
    });

    socket.on('signal', async ({ from, signal }) => {
      if (!peerConnection.current) return;
      
      if (signal.type === 'offer') {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(signal));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.emit('signal', { to: from, signal: answer });
      } else if (signal.type === 'answer') {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(signal));
      } else if (signal.candidate) {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(signal.candidate));
      }
    });

    socket.on('peer-left', () => {
      setPeerConnected(false);
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    });

    return () => {
      socket.off('peer-joined');
      socket.off('signal');
      socket.off('peer-left');
      if (userStream.current) userStream.current.getTracks().forEach(track => track.stop());
    };
  }, [roomCode]);

  const initWebRTC = (stream: MediaStream) => {
    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
    peerConnection.current = new RTCPeerConnection(configuration);

    // Add local tracks to peer connection
    stream.getTracks().forEach(track => peerConnection.current?.addTrack(track, stream));

    // Handle incoming remote media stream profile
    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setPeerConnected(true);
      }
    };

    // Handle ICE candidates
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('signal', { to: roomCode, signal: { candidate: event.candidate } });
      }
    };
  };

  const toggleMute = () => {
    if (userStream.current) {
      userStream.current.getAudioTracks()[0].enabled = isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleCamera = () => {
    if (userStream.current) {
      userStream.current.getVideoTracks()[0].enabled = isCamOff;
      setIsCamOff(!isCamOff);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', color: '#fff', margin: 0 }}>Room Instance: <span style={{ color: '#38bdf8' }}>{roomCode}</span></h2>
        <span style={{ color: peerConnected ? '#4ade80' : '#94a3b8', fontSize: '14px' }}>
          ● {peerConnected ? 'Remote Peer Synced' : 'Awaiting Peer Connection...'}
        </span>
      </div>

      {/* Grid Video Structure */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', minHeight: '400px' }}>
        {/* Local Node Stream */}
        <div style={{ background: '#0f172a', borderRadius: '16px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.05)' }}>
          <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
            You {isMuted && '🎙️ Muted'}
          </div>
        </div>

        {/* Remote Engine Stream Box */}
        <div style={{ background: '#0f172a', borderRadius: '16px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {peerConnected ? (
            <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ textAlign: 'center', color: '#64748b' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>👤</div>
              <p style={{ margin: 0, fontSize: '14px' }}>Waiting for another peer to join code: <strong>{roomCode}</strong></p>
            </div>
          )}
          {peerConnected && (
            <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
              Channel Peer
            </div>
          )}
        </div>
      </div>

      {/* Corporate Controller Hub */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', background: '#1e293b', padding: '16px', borderRadius: '16px' }}>
        <button onClick={toggleMute} style={{ padding: '12px 24px', background: isMuted ? '#f43f5e' : '#334155', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>
          {isMuted ? 'Unmute Audio 🎙️' : 'Mute Audio 🔇'}
        </button>
        <button onClick={toggleCamera} style={{ padding: '12px 24px', background: isCamOff ? '#f43f5e' : '#334155', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>
          {isCamOff ? 'Start Camera 📹' : 'Stop Camera 📷'}
        </button>
        <button onClick={onLeave} style={{ padding: '12px 24px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>
          Leave Call 🟥
        </button>
      </div>
    </div>
  );
}

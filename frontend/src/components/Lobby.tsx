import React, { useState } from 'react';
import MeetingRoom from './MeetingRoom';
import MeetingSummary from './MeetingSummary';

export default function Lobby() {
  const [meetingCode, setMeetingCode] = useState('');
  const [viewState, setViewState] = useState<'LOBBY' | 'ROOM' | 'SUMMARY'>('LOBBY');
  const [currentRoom, setCurrentRoom] = useState('');
  const [startTime, setStartTime] = useState<number>(0);
  const [finalDuration, setFinalDuration] = useState<string>('0 mins 0 secs');

  const handleCreateMeeting = () => {
    const generatedCode = 'MEET-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    setCurrentRoom(generatedCode);
    setStartTime(Date.now()); // Call start time register kiya
    setViewState('ROOM');
  };

  const handleJoinMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (meetingCode.trim()) {
      setCurrentRoom(meetingCode.toUpperCase());
      setStartTime(Date.now());
      setViewState('ROOM');
    }
  };

  const handleLeaveCall = () => {
    // Total call timing evaluate karna
    const diffMs = Date.now() - startTime;
    const totalSecs = Math.floor(diffMs / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    
    setFinalDuration(`${mins} mins ${secs} secs`);
    setViewState('SUMMARY');
  };

  if (viewState === 'ROOM') {
    return <MeetingRoom roomCode={currentRoom} onLeave={handleLeaveCall} />;
  }

  if (viewState === 'SUMMARY') {
    return <MeetingSummary roomCode={currentRoom} duration={finalDuration} onRestart={() => setViewState('LOBBY')} />;
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: '680px',
      background: 'rgba(30, 41, 59, 0.6)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '24px',
      padding: '40px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', margin: 0 }}>Lobby Workspace</h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '4px' }}>Initialize or jump into encrypted streams</p>
        </div>
        <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
          AI Shield Active
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(15, 23, 42, 0.4)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#38bdf8', margin: '0 0 8px 0' }}>Instant Broadcast</h3>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>Generate an instant peer-to-peer enterprise collaboration space dynamically.</p>
          </div>
          <button 
            onClick={handleCreateMeeting}
            style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', marginTop: '20px', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}
          >
            Start New Meeting
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(15, 23, 42, 0.4)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#818cf8', margin: '0 0 8px 0' }}>Secure Entry</h3>
          <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', marginBottom: '16px' }}>Provide a workspace authentication token or invitation code to connect.</p>
          
          <form onSubmit={handleJoinMeeting} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
            <input 
              type="text" 
              placeholder="e.g. MEET-ABCD"
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
              style={{ width: '100%', padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              required
            />
            <button 
              type="submit"
              style={{ width: '100%', padding: '12px', background: '#334155', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}
            >
              Join Room
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
import React from 'react';

interface MeetingSummaryProps {
  roomCode: string;
  duration: string; // Dynamic timing string receive ho rhi hai
  onRestart: () => void;
}

export default function MeetingSummary({ roomCode, duration, onRestart }: MeetingSummaryProps) {
  return (
    <div style={{
      width: '100%',
      maxWidth: '750px',
      background: 'rgba(30, 41, 59, 0.6)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '24px',
      padding: '40px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
    }}>
      <div style={{ textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '24px', marginBottom: '32px' }}>
        <span style={{ fontSize: '50px' }}>📊</span>
        <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#38bdf8', margin: '12px 0 4px 0' }}>AI Post-Meeting Insights</h2>
        <p style={{ fontSize: '14px', color: '#94a3b8' }}>Automated analytical breakdown for session: <strong style={{ color: '#fff' }}>{roomCode}</strong></p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: '#090d16', border: '1px solid #1e293b', padding: '20px', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '15px', color: '#a78bfa', fontWeight: '700', margin: '0 0 12px 0' }}>🔑 Core Keypoints</h3>
          <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '13px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>Full-stack project layout standardisation completed.</li>
            <li>React client-state initialized with Zustand modules.</li>
            <li>Peer-to-peer enterprise streaming pipeline verified.</li>
          </ul>
        </div>

        <div style={{ background: '#090d16', border: '1px solid #1e293b', padding: '20px', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '15px', color: '#f43f5e', fontWeight: '700', margin: '0 0 12px 0' }}>⚡ Assigned Action Items</h3>
          <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '13px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><strong>Frontend:</strong> Integrate secure endpoint APIs for token validation.</li>
            <li><strong>AI Core:</strong> Setup continuous live transcription caching structures.</li>
          </ul>
        </div>
      </div>

      {/* Dynamic Duration Render Grid */}
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'space-between', background: 'rgba(15, 23, 42, 0.4)', padding: '16px 24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)', marginBottom: '32px' }}>
        <div style={{ fontSize: '13px', color: '#64748b' }}>Duration: <strong style={{ color: '#fff' }}>{duration}</strong></div>
        <div style={{ fontSize: '13px', color: '#64748b' }}>AI Accuracy Index: <strong style={{ color: '#4ade80' }}>98.4%</strong></div>
        <div style={{ fontSize: '13px', color: '#64748b' }}>Security Level: <strong style={{ color: '#38bdf8' }}>E2EE Enabled</strong></div>
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <button 
          onClick={() => {
            const reportData = `INTELLMEET SESSION REPORT\nRoom: ${roomCode}\nDuration: ${duration}\n\nKeypoints:\n- Full-stack layout configured.\n- E2EE streaming validated.`;
            const blob = new Blob([reportData], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `IntellMeet-${roomCode}-Summary.txt`;
            link.click();
          }}
          style={{ flexGrow: 1, padding: '14px', background: '#334155', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}
        >
          Download Transcript Report
        </button>
        <button 
          onClick={onRestart}
          style={{ flexGrow: 1, padding: '14px', background: 'linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}
        >
          Return to Lobby Workspace
        </button>
      </div>
    </div>
  );
}
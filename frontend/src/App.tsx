import React from 'react';
import Login from './components/Login';
import Lobby from './components/Lobby';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <>
      {/* Top Navbar Header */}
      <header style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', width: '100%' }}>
        <h1 style={{
          fontSize: '54px',
          fontWeight: '900',
          letterSpacing: '-1.5px',
          margin: '0',
          background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0px 4px 20px rgba(56, 189, 248, 0.3)'
        }}>
          IntellMeet
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '17px', marginTop: '12px', fontWeight: '500' }}>
          AI-Powered Enterprise Collaboration Platform
        </p>

        {/* User Badge Float (Visible only when logged in) */}
        {user && (
          <div style={{ position: 'absolute', top: '-10px', right: '20px', display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(30,41,59,0.5)', padding: '8px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>{user.name}</div>
              <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: '600' }}>{user.role} Account</div>
            </div>
            <button 
              onClick={logout}
              style={{ padding: '6px 12px', background: '#f43f5e', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
            >
              Sign Out
            </button>
          </div>
        )}
      </header>

      {/* Main Workspace Area */}
      {!user ? (
        <Login />
      ) : (
        <Lobby />
      )}
    </>
  );
}

export default App;
import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      // Node.js backend server connection endpoint
      const response = await fetch('https://intellmeet-enterprise-platform.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Synchronizing corporate user payload into Zustand store
        setAuth(data.user, data.token);
      } else {
        setErrorMsg(data.message || 'Invalid enterprise credentials');
      }
    } catch (err) {
      console.error('API Error:', err);
      setErrorMsg('Cannot connect to IntellMeet backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.7)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '24px',
      padding: '40px',
      width: '100%',
      maxWidth: '420px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 0 40px rgba(59, 130, 246, 0.15)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px', color: '#ffffff', margin: '0' }}>
          Welcome Back
        </h2>
        <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '8px' }}>
          Secure access to your IntellMeet portal
        </p>
      </div>

      {errorMsg && (
        <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid #f43f5e', color: '#f43f5e', padding: '12px', borderRadius: '12px', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: '#94a3b8', marginBottom: '8px' }}>
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '12px',
              background: '#0f172a',
              border: '1px solid #334155',
              color: '#ffffff',
              fontSize: '15px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            placeholder="name@zidio.com"
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: '#94a3b8', marginBottom: '8px' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '12px',
              background: '#0f172a',
              border: '1px solid #334155',
              color: '#ffffff',
              fontSize: '15px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
          }}
        >
          {isLoading ? 'Verifying Identity...' : 'Sign In to Workspace'}
        </button>
      </form>

      {/* Premium Evaluator Testing Helper Badge */}
      <div style={{ 
        marginTop: '24px', 
        padding: '14px', 
        background: 'rgba(56, 189, 248, 0.03)', 
        borderRadius: '16px', 
        border: '1px solid rgba(56, 189, 248, 0.15)', 
        textAlign: 'center' 
      }}>
        <p style={{ margin: '0 0 6px 0', fontSize: '11px', color: '#38bdf8', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
          🔑 Demo System Credentials
        </p>
        <p style={{ margin: '0', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4' }}>
          Email: <span style={{ color: '#fff', fontWeight: '600' }}>name@zidio.com</span> <br />
          Pass: <span style={{ color: '#fff', fontWeight: '600' }}>password123</span>
        </p>
      </div>

    </div>
  );
}

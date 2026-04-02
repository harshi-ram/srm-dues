'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export default function JoinClassModal({ onJoin, onClose }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await api.post('/api/classes/join', { code: code.toUpperCase() });
      onJoin(data.class);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: '#111827' }}>Join a class</h3>
        <input
          placeholder="Enter 6-letter class code"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === 'Enter' && handleJoin()}
          autoFocus
          maxLength={6}
          style={{
            width: '100%', padding: '10px 12px', borderRadius: 6,
            border: '1px solid #d1d5db', fontSize: 16, fontWeight: 600,
            letterSpacing: '0.15em', textAlign: 'center', boxSizing: 'border-box',
            marginBottom: 8,
          }}
        />
        {error && <p style={errorStyle}>{error}</p>}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
          <button onClick={onClose} style={ghostBtn}>Cancel</button>
          <button onClick={handleJoin} disabled={loading} style={btnStyle}>
            {loading ? 'Joining...' : 'Join class'}
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
};
const modal = {
  background: '#fff', padding: 24, borderRadius: 12, width: '100%',
  maxWidth: 340, boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
};
const btnStyle = { padding: '9px 16px', borderRadius: 6, background: '#4f46e5', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500 };
const ghostBtn = { padding: '9px 16px', borderRadius: 6, background: 'transparent', color: '#374151', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: 14 };
const errorStyle = { color: '#ef4444', fontSize: 13, margin: '0 0 4px', padding: '8px 12px', background: '#fef2f2', borderRadius: 6 };

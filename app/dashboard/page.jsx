'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { api } from '@/lib/api';
import JoinClassModal from '@/components/JoinClassModal';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState('');
  const [showJoin, setShowJoin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    api.get('/api/classes')
      .then(data => { setClasses(data); setLoading(false); })
      .catch(() => router.push('/login'));
  }, [user]);

  const createClass = async () => {
    if (!newClassName.trim()) return;
    try {
      const cls = await api.post('/api/classes', { name: newClassName });
      setClasses(prev => [cls, ...prev]);
      setNewClassName('');
    } catch (err) {
      alert(err.message);
    }
  };

  if (!user) return null;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px' }}>

      {/* Header */}
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
  
  {/* LEFT: Logo + Title */}
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    
    {/* Logo Image */}
    <img 
      src="/logo.png" 
      alt="logo" 
      style={{ width: 36, height: 36, objectFit: 'contain' }}
    />

    <div>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: '#16a34a' }}>
        SRM Dues
      </h1>
      <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 14 }}>
        Welcome back, {user.name}
      </p>
    </div>

  </div>

  {/* RIGHT: Actions */}
  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
    <Link href="/planner" style={linkBtnStyle}>Task Planner</Link>
    <button onClick={logout} style={ghostBtn}>Logout</button>
  </div>

</div>

      {/* Classes */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#374151' }}>Your classes</h2>
      </div>

      {loading && <p style={{ color: '#9ca3af' }}>Loading...</p>}

      {!loading && classes.length === 0 && (
        <div style={emptyCard}>
          <p style={{ margin: 0, color: '#9ca3af' }}>No classes yet — create or join one below.</p>
        </div>
      )}

      {classes.map(cls => (
        <div key={cls.id} onClick={() => router.push(`/class/${cls.id}`)} style={classCard}>
          <div>
            <p style={{ margin: 0, fontWeight: 500, color: '#111827' }}>{cls.name}</p>
          </div>
          <span style={codeBadge}>{cls.code}</span>
        </div>
      ))}

      {/* Actions */}
      <div style={{ marginTop: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input
          placeholder="New class name"
          value={newClassName}
          onChange={e => setNewClassName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && createClass()}
          style={inputStyle}
        />
        <button onClick={createClass} style={btnStyle}>Create class</button>
        <button onClick={() => setShowJoin(true)} style={ghostBtn}>Join class</button>
      </div>

      {showJoin && (
        <JoinClassModal
          onJoin={cls => { setClasses(prev => [cls, ...prev]); setShowJoin(false); }}
          onClose={() => setShowJoin(false)}
        />
      )}
    </div>
  );
}

const classCard = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8,
  padding: '14px 16px', marginBottom: 8, cursor: 'pointer',
};
const codeBadge = {
  fontSize: 12, fontWeight: 600, letterSpacing: '0.05em',
  background: '#f3f4f6', color: '#6b7280', padding: '4px 10px', borderRadius: 20,
};
const emptyCard = {
  background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8,
  padding: '24px 16px', textAlign: 'center', marginBottom: 8,
};
const inputStyle = { padding: '9px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 14, flex: 1, minWidth: 160 };
const btnStyle = { padding: '9px 16px', borderRadius: 6, background: '#13c32d', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap' };
const ghostBtn = { padding: '9px 16px', borderRadius: 6, background: 'transparent', color: '#374151', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: 14, whiteSpace: 'nowrap' };
const linkBtnStyle = { padding: '9px 16px', borderRadius: 6, background: '#ede9fe', color: '#17a033', fontSize: 14, fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' };

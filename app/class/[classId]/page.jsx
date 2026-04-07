'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { api } from '@/lib/api';
import ReminderCard from '@/components/ReminderCard';

const EMPTY_FORM = { title: '', description: '', due_date: '', effort: 'medium' };

export default function ClassPage() {
  const { classId } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    api.get(`/api/classes/${classId}/reminders`)
      .then(data => { setReminders(data); setLoading(false); })
      .catch(() => router.push('/dashboard'));
  }, [user, classId]);

  const addReminder = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await api.post('/api/reminders', { ...form, class_id: Number(classId) });
      setReminders(prev => [...prev, { ...data, completed: 0 }]);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleComplete = async (id, completed) => {
    const endpoint = completed
      ? `/api/reminders/${id}/uncomplete`
      : `/api/reminders/${id}/complete`;
    await api.patch(endpoint);
    setReminders(prev =>
      prev.map(r => r.id === id ? { ...r, completed: completed ? 0 : 1 } : r)
    );
  };

  if (!user) return null;

  const pending   = reminders.filter(r => !r.completed);
  const completed = reminders.filter(r => r.completed);

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Link href="/dashboard" style={{ color: '#139545', fontSize: 14, textDecoration: 'none' }}>← Dashboard</Link>
        <h1 style={{ margin: '8px 0 0', fontSize: 22, fontWeight: 600, color: '#111827' }}>Class reminders</h1>
      </div>

      {/* Add reminder form */}
      <div style={formCard}>
        <p style={{ margin: '0 0 12px', fontWeight: 500, fontSize: 14, color: '#374151' }}>Add a reminder</p>
        <form onSubmit={addReminder} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <input placeholder="Title" value={form.title} required
            onChange={e => setForm({ ...form, title: e.target.value })}
            style={{ ...inputStyle, flex: '2 1 160px' }} />
          <input placeholder="Description (optional)" value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            style={{ ...inputStyle, flex: '3 1 200px' }} />
          <input type="date" value={form.due_date} required
            onChange={e => setForm({ ...form, due_date: e.target.value })}
            style={{ ...inputStyle, flex: '1 1 140px' }} />
          <select value={form.effort}
            onChange={e => setForm({ ...form, effort: e.target.value })}
            style={{ ...inputStyle, flex: '1 1 130px' }}>
            <option value="low">Low effort</option>
            <option value="medium">Medium effort</option>
            <option value="high">High effort</option>
          </select>
          <button type="submit" style={btnStyle}>Add</button>
        </form>
        {error && <p style={errorStyle}>{error}</p>}
      </div>

      {/* Pending */}
      {loading && <p style={{ color: '#9ca3af' }}>Loading...</p>}
      {!loading && pending.length === 0 && (
        <p style={{ color: '#9ca3af', textAlign: 'center', padding: '24px 0' }}>No pending reminders.</p>
      )}
      {pending.map(r => <ReminderCard key={r.id} reminder={r} onToggle={toggleComplete} />)}

      {/* Completed */}
      {completed.length > 0 && (
        <>
          <p style={{ margin: '24px 0 8px', fontSize: 13, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Completed ({completed.length})
          </p>
          {completed.map(r => <ReminderCard key={r.id} reminder={r} onToggle={toggleComplete} />)}
        </>
      )}
    </div>
  );
}

const formCard = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 20 };
const inputStyle = { padding: '9px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 14 };
const btnStyle = { padding: '9px 16px', borderRadius: 6, background: '#119511', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500 };
const errorStyle = { color: '#ef4444', fontSize: 13, margin: '8px 0 0', padding: '8px 12px', background: '#fef2f2', borderRadius: 6 };

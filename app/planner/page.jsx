'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { api } from '@/lib/api';
import ScheduleView from '@/components/ScheduleView';

export default function PlannerPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [daysAvailable, setDaysAvailable] = useState(7);
  const [targetDate, setTargetDate] = useState('');
  const [schedule, setSchedule] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user]);

  const generate = async () => {
    if (!targetDate) return setError('Please set a target date');
    setLoading(true);
    setError('');
    setSchedule(null);
    setMessage('');
    try {
      const data = await api.post('/api/planner', { daysAvailable, targetDate });
      setSchedule(data.schedule);
      if (data.message) setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Link href="/dashboard" style={{ color: '#28a113', fontSize: 14, textDecoration: 'none' }}>← Dashboard</Link>
        <h1 style={{ margin: '8px 0 4px', fontSize: 22, fontWeight: 600, color: '#111827' }}>Task planner</h1>
        <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
          Schedules your pending reminders across available days based on effort level.
          High effort tasks get a full day, medium tasks half a day, low tasks a quarter.
        </p>
      </div>

      {/* Controls */}
      <div style={controlCard}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <label style={labelStyle}>
            Days available
            <input type="number" min={1} max={60} value={daysAvailable}
              onChange={e => setDaysAvailable(Number(e.target.value))}
              style={{ ...inputStyle, width: 80, marginTop: 6 }} />
          </label>
          <label style={labelStyle}>
            Target / exam date
            <input type="date" value={targetDate}
              onChange={e => setTargetDate(e.target.value)}
              style={{ ...inputStyle, marginTop: 6 }} />
          </label>
          <button onClick={generate} disabled={loading} style={btnStyle}>
            {loading ? 'Generating...' : 'Generate schedule'}
          </button>
        </div>
        {error && <p style={errorStyle}>{error}</p>}
      </div>

      {message && <p style={{ color: '#9ca3af', textAlign: 'center', padding: '16px 0' }}>{message}</p>}
      {schedule && <ScheduleView schedule={schedule} />}
    </div>
  );
}

const controlCard = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 20, marginBottom: 24 };
const labelStyle = { display: 'flex', flexDirection: 'column', fontSize: 13, fontWeight: 500, color: '#374151' };
const inputStyle = { padding: '9px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 14 };
const btnStyle = { padding: '9px 20px', borderRadius: 6, background: '#24a219', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, alignSelf: 'flex-end' };
const errorStyle = { color: '#ef4444', fontSize: 13, margin: '12px 0 0', padding: '8px 12px', background: '#fef2f2', borderRadius: 6 };

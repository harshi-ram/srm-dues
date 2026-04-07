'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await api.post('/api/auth', { action: 'register', ...form });
      login(data.user, data.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={{ margin: '0 0 24px' }}>Create account</h2>
        {error && <p style={errorStyle}>{error}</p>}
        <form onSubmit={handleSubmit} style={formStyle}>
          <input placeholder="Full name" value={form.name} required
            onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
          <input placeholder="Email" type="email" value={form.email} required
            onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
          <input placeholder="Password" type="password" value={form.password} required
            onChange={e => setForm({ ...form, password: e.target.value })} style={inputStyle} />
          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p style={{ marginTop: 16, color: '#6b7280', fontSize: 14 }}>
          Have an account? <Link href="/login" style={{ color: '#16a72c' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

const pageStyle = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 };
const cardStyle = { background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 32, width: '100%', maxWidth: 400 };
const formStyle = { display: 'flex', flexDirection: 'column', gap: 12 };
const inputStyle = { padding: '10px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 14, outline: 'none' };
const btnStyle = { padding: '10px 16px', borderRadius: 6, background: '#14ad1e', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500 };
const errorStyle = { color: '#ef4444', fontSize: 13, margin: '0 0 12px', padding: '8px 12px', background: '#fef2f2', borderRadius: 6 };

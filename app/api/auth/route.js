import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import getDb from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(request) {
  const { action, name, email, password } = await request.json();
  const db = getDb();

  if (action === 'register') {
    if (!name || !email || !password)
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });

    try {
      const passwordHash = await bcrypt.hash(password, 10);
      const result = db.prepare(
        'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)'
      ).run(name, email, passwordHash);

      const token = signToken({ id: result.lastInsertRowid, email });
      return NextResponse.json(
        { token, user: { id: result.lastInsertRowid, name, email } },
        { status: 201 }
      );
    } catch (err) {
      if (err.message.includes('UNIQUE'))
        return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  }

  if (action === 'login') {
    if (!email || !password)
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = signToken({ id: user.id, email: user.email });
    return NextResponse.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

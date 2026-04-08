import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import db from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(request) {
  const { action, name, email, password } = await request.json();

  if (action === 'register') {
    if (!name || !email || !password)
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });

    try {
      const passwordHash = await bcrypt.hash(password, 10);

      const result = await db.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
        [name, email, passwordHash]
      );

      const userId = result.rows[0].id;
      const token = signToken({ id: userId, email });
      return NextResponse.json(
        { token, user: { id: userId, name, email } },
        { status: 201 }
      );
    } catch (err) {
      if (err.message.includes('unique') || err.message.includes('duplicate'))
        return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  if (action === 'login') {
    if (!email || !password)
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });

    try {
      const result = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      const user = result.rows[0];

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
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
import { NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { getUserFromRequest, unauthorized } from '@/lib/auth';

export async function GET(request) {
  const user = getUserFromRequest(request);
  if (!user) return unauthorized();
  const db = getDb();

  const classes = db.prepare(`
    SELECT c.* FROM classes c
    JOIN class_members cm ON cm.class_id = c.id
    WHERE cm.user_id = ?
    ORDER BY c.created_at DESC
  `).all(user.id);

  return NextResponse.json(classes);
}

export async function POST(request) {
  const user = getUserFromRequest(request);
  if (!user) return unauthorized();
  const db = getDb();

  const { name } = await request.json();
  if (!name)
    return NextResponse.json({ error: 'Class name required' }, { status: 400 });

  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  const result = db.prepare(
    'INSERT INTO classes (name, code, created_by) VALUES (?, ?, ?)'
  ).run(name, code, user.id);

  db.prepare(
    'INSERT INTO class_members (user_id, class_id) VALUES (?, ?)'
  ).run(user.id, result.lastInsertRowid);

  return NextResponse.json(
    { id: result.lastInsertRowid, name, code },
    { status: 201 }
  );
}

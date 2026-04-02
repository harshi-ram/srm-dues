import { NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { getUserFromRequest, unauthorized } from '@/lib/auth';

export async function POST(request) {
  const user = getUserFromRequest(request);
  if (!user) return unauthorized();
  const db = getDb();

  const { title, description, due_date, effort, class_id } = await request.json();
  if (!title || !due_date || !effort || !class_id)
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

  const member = db.prepare(
    'SELECT 1 FROM class_members WHERE user_id = ? AND class_id = ?'
  ).get(user.id, class_id);
  if (!member)
    return NextResponse.json({ error: 'Not a member of this class' }, { status: 403 });

  const result = db.prepare(`
    INSERT INTO reminders (title, description, due_date, effort, class_id, created_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(title, description ?? null, due_date, effort, class_id, user.id);

  return NextResponse.json(
    { id: result.lastInsertRowid, title, description, due_date, effort, class_id },
    { status: 201 }
  );
}

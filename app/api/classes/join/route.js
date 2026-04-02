import { NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { getUserFromRequest, unauthorized } from '@/lib/auth';

export async function POST(request) {
  const user = getUserFromRequest(request);
  if (!user) return unauthorized();
  const db = getDb();

  const { code } = await request.json();
  const cls = db.prepare('SELECT * FROM classes WHERE code = ?').get(code?.toUpperCase());
  if (!cls)
    return NextResponse.json({ error: 'Invalid class code' }, { status: 404 });

  try {
    db.prepare(
      'INSERT INTO class_members (user_id, class_id) VALUES (?, ?)'
    ).run(user.id, cls.id);
    return NextResponse.json({ message: 'Joined successfully', class: cls });
  } catch {
    return NextResponse.json({ error: 'Already a member of this class' }, { status: 409 });
  }
}

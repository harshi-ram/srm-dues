import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserFromRequest, unauthorized } from '@/lib/auth';

export async function POST(request) {
  const user = getUserFromRequest(request);
  if (!user) return unauthorized();

  const { code } = await request.json();

  const clsResult = await db.query(
    'SELECT * FROM classes WHERE code = $1',
    [code?.toUpperCase()]
  );
  const cls = clsResult.rows[0];

  if (!cls)
    return NextResponse.json({ error: 'Invalid class code' }, { status: 404 });

  try {
    await db.query(
      'INSERT INTO class_members (user_id, class_id) VALUES ($1, $2)',
      [user.id, cls.id]
    );
    return NextResponse.json({ message: 'Joined successfully', class: cls });
  } catch {
    return NextResponse.json({ error: 'Already a member of this class' }, { status: 409 });
  }
}

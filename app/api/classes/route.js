import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserFromRequest, unauthorized } from '@/lib/auth';

export async function GET(request) {
  const user = getUserFromRequest(request);
  if (!user) return unauthorized();

  const classes = await db.query(
    `SELECT c.* FROM classes c
     JOIN class_members cm ON cm.class_id = c.id
     WHERE cm.user_id = $1
     ORDER BY c.created_at DESC`,
    [user.id]
  );

  return NextResponse.json(classes.rows);
}

export async function POST(request) {
  const user = getUserFromRequest(request);
  if (!user) return unauthorized();

  const { name } = await request.json();
  if (!name)
    return NextResponse.json({ error: 'Class name required' }, { status: 400 });

  try {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const result = await db.query(
      'INSERT INTO classes (name, code, created_by) VALUES ($1, $2, $3) RETURNING id',
      [name, code, user.id]
    );

    const classId = result.rows[0].id;

    await db.query(
      'INSERT INTO class_members (user_id, class_id) VALUES ($1, $2)',
      [user.id, classId]
    );

    return NextResponse.json({ id: classId, name, code }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserFromRequest, unauthorized } from '@/lib/auth';

export async function POST(request) {
  const user = getUserFromRequest(request);
  if (!user) return unauthorized();

  const { title, description, due_date, effort, class_id } = await request.json();
  if (!title || !due_date || !effort || !class_id)
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

  const memberCheck = await db.query(
    'SELECT 1 FROM class_members WHERE user_id = $1 AND class_id = $2',
    [user.id, class_id]
  );
  if (memberCheck.rows.length === 0)
    return NextResponse.json({ error: 'Not a member of this class' }, { status: 403 });

  try {
    const result = await db.query(
      `INSERT INTO reminders (title, description, due_date, effort, class_id, created_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [title, description ?? null, due_date, effort, class_id, user.id]
    );

    const id = result.rows[0].id;
    return NextResponse.json(
      { id, title, description, due_date, effort, class_id },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

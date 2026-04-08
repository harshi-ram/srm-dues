import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserFromRequest, unauthorized } from '@/lib/auth';

export async function PATCH(request, { params }) {
  const user = getUserFromRequest(request);
  if (!user) return unauthorized();

  try {
    // INSERT ... ON CONFLICT DO NOTHING is the Postgres equivalent of INSERT OR IGNORE
    await db.query(
      `INSERT INTO completed_reminders (user_id, reminder_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [user.id, params.reminderId]
    );
    return NextResponse.json({ message: 'Marked as complete' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

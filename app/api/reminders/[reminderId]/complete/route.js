import { NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { getUserFromRequest, unauthorized } from '@/lib/auth';

export async function PATCH(request, { params }) {
  const user = getUserFromRequest(request);
  if (!user) return unauthorized();
  const db = getDb();

  db.prepare(
    'INSERT OR IGNORE INTO completed_reminders (user_id, reminder_id) VALUES (?, ?)'
  ).run(user.id, params.reminderId);

  return NextResponse.json({ message: 'Marked as complete' });
}

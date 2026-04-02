import { NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { getUserFromRequest, unauthorized } from '@/lib/auth';

export async function PATCH(request, { params }) {
  const user = getUserFromRequest(request);
  if (!user) return unauthorized();
  const db = getDb();

  db.prepare(
    'DELETE FROM completed_reminders WHERE user_id = ? AND reminder_id = ?'
  ).run(user.id, params.reminderId);

  return NextResponse.json({ message: 'Marked as incomplete' });
}

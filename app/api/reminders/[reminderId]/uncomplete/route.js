import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserFromRequest, unauthorized } from '@/lib/auth';

export async function PATCH(request, { params }) {
  const user = getUserFromRequest(request);
  if (!user) return unauthorized();

  try {
    await db.query(
      'DELETE FROM completed_reminders WHERE user_id = $1 AND reminder_id = $2',
      [user.id, params.reminderId]
    );
    return NextResponse.json({ message: 'Marked as incomplete' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

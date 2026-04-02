import { NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { getUserFromRequest, unauthorized } from '@/lib/auth';

export async function GET(request, { params }) {
  const user = getUserFromRequest(request);
  if (!user) return unauthorized();
  const db = getDb();

  const { classId } = params;

  const member = db.prepare(
    'SELECT 1 FROM class_members WHERE user_id = ? AND class_id = ?'
  ).get(user.id, classId);
  if (!member)
    return NextResponse.json({ error: 'Not a member of this class' }, { status: 403 });

  const reminders = db.prepare(`
    SELECT r.*,
      CASE WHEN cr.user_id IS NOT NULL THEN 1 ELSE 0 END AS completed
    FROM reminders r
    LEFT JOIN completed_reminders cr
      ON cr.reminder_id = r.id AND cr.user_id = ?
    WHERE r.class_id = ?
    ORDER BY r.due_date ASC
  `).all(user.id, classId);

  return NextResponse.json(reminders);
}

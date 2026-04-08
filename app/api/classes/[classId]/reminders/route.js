import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserFromRequest, unauthorized } from '@/lib/auth';

export async function GET(request, { params }) {
  const user = getUserFromRequest(request);
  if (!user) return unauthorized();

  const { classId } = params;

  const memberCheck = await db.query(
    'SELECT 1 FROM class_members WHERE user_id = $1 AND class_id = $2',
    [user.id, classId]
  );
  if (memberCheck.rows.length === 0)
    return NextResponse.json({ error: 'Not a member of this class' }, { status: 403 });

  const reminders = await db.query(
    `SELECT r.*,
       CASE WHEN cr.user_id IS NOT NULL THEN true ELSE false END AS completed
     FROM reminders r
     LEFT JOIN completed_reminders cr
       ON cr.reminder_id = r.id AND cr.user_id = $1
     WHERE r.class_id = $2
     ORDER BY r.due_date ASC`,
    [user.id, classId]
  );

  return NextResponse.json(reminders.rows);
}

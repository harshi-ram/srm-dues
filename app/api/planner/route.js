import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserFromRequest, unauthorized } from '@/lib/auth';
import { generateSchedule } from '@/lib/planner';

export async function POST(request) {
  const user = getUserFromRequest(request);
  if (!user) return unauthorized();

  const { daysAvailable, targetDate } = await request.json();
  if (!daysAvailable || !targetDate)
    return NextResponse.json({ error: 'daysAvailable and targetDate required' }, { status: 400 });

  try {
    const result = await db.query(
      `SELECT r.title, r.due_date, r.effort
       FROM reminders r
       JOIN class_members cm ON cm.class_id = r.class_id
       WHERE cm.user_id = $1
         AND r.id NOT IN (
           SELECT reminder_id FROM completed_reminders WHERE user_id = $2
         )
       ORDER BY r.due_date ASC`,
      [user.id, user.id]
    );

    const reminders = result.rows;

    if (reminders.length === 0)
      return NextResponse.json({ schedule: [], message: 'No pending reminders' });

    const schedule = generateSchedule(reminders, daysAvailable, targetDate);
    return NextResponse.json({ schedule });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

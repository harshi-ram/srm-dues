import { NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { getUserFromRequest, unauthorized } from '@/lib/auth';
import { generateSchedule } from '@/lib/planner';

export async function POST(request) {
  const user = getUserFromRequest(request);
  if (!user) return unauthorized();
  const db = getDb();

  const { daysAvailable, targetDate } = await request.json();
  if (!daysAvailable || !targetDate)
    return NextResponse.json({ error: 'daysAvailable and targetDate required' }, { status: 400 });

  const reminders = db.prepare(`
    SELECT r.title, r.due_date, r.effort
    FROM reminders r
    JOIN class_members cm ON cm.class_id = r.class_id
    WHERE cm.user_id = ?
      AND r.id NOT IN (
        SELECT reminder_id FROM completed_reminders WHERE user_id = ?
      )
    ORDER BY r.due_date ASC
  `).all(user.id, user.id);

  if (reminders.length === 0)
    return NextResponse.json({ schedule: [], message: 'No pending reminders' });

  const schedule = generateSchedule(reminders, daysAvailable, targetDate);
  return NextResponse.json({ schedule });
}

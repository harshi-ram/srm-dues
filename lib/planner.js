const effortWeight = { high: 3, medium: 2, low: 1 };
const effortDays   = { high: 1.0, medium: 0.5, low: 0.25 };

export function generateSchedule(reminders, daysAvailable, targetDate) {
  const target = new Date(targetDate);
  const today  = new Date();
  today.setHours(0, 0, 0, 0);

  // Sort by due date first, then high effort first within the same date
  const sorted = [...reminders].sort((a, b) => {
    const dateDiff = new Date(a.due_date) - new Date(b.due_date);
    if (dateDiff !== 0) return dateDiff;
    return effortWeight[b.effort] - effortWeight[a.effort];
  });

  // Build one slot per available day, stopping at targetDate
  const slots = [];
  for (let i = 0; i < daysAvailable; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    if (date > target) break;
    slots.push({
      day: i + 1,
      date: date.toISOString().split('T')[0],
      tasks: [],
      load: 0, // 1.0 = full day
    });
  }

  if (slots.length === 0) return [];

  // Greedily assign each task to the first slot that has room
  for (const reminder of sorted) {
    const cost = effortDays[reminder.effort];
    const slot = slots.find(d => d.load + cost <= 1.0);
    if (slot) {
      slot.tasks.push(reminder.title);
      slot.load += cost;
    } else {
      // Overflow: spill into the least loaded day
      const lightest = slots.reduce((a, b) => a.load < b.load ? a : b);
      lightest.tasks.push(reminder.title);
      lightest.load += cost;
    }
  }

  // Return only days with tasks, strip internal load field
  return slots
    .filter(d => d.tasks.length > 0)
    .map(({ day, date, tasks }) => ({ day, date, tasks }));
}

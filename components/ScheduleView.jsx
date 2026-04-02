'use client';

const dayColors = [
  '#ede9fe', '#dbeafe', '#dcfce7', '#fef9c3', '#ffe4e6',
  '#e0f2fe', '#fce7f3', '#f3e8ff', '#ecfdf5', '#fff7ed',
];

export default function ScheduleView({ schedule }) {
  if (!schedule.length)
    return (
      <div style={{ textAlign: 'center', padding: '32px 0', color: '#9ca3af' }}>
        No tasks to schedule — all reminders may already be completed.
      </div>
    );

  return (
    <div>
      <p style={{ margin: '0 0 12px', fontSize: 13, color: '#6b7280' }}>
        {schedule.length} day{schedule.length !== 1 ? 's' : ''} planned &mdash; {schedule.reduce((n, d) => n + d.tasks.length, 0)} tasks total
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        {schedule.map((day, i) => (
          <div key={day.day} style={{
            background: dayColors[i % dayColors.length],
            borderRadius: 10, padding: '14px 16px',
          }}>
            <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: 13, color: '#374151' }}>
              Day {day.day}
            </p>
            <p style={{ margin: '0 0 10px', fontSize: 12, color: '#6b7280' }}>{day.date}</p>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {day.tasks.map((task, j) => (
                <li key={j} style={{ fontSize: 13, color: '#1f2937', marginBottom: 4 }}>{task}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

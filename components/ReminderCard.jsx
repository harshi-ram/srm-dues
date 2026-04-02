'use client';

const effortColors = {
  low:    { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
  medium: { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
  high:   { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
};

export default function ReminderCard({ reminder, onToggle }) {
  const colors = effortColors[reminder.effort];

  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8,
      padding: '12px 16px', marginBottom: 8,
      opacity: reminder.completed ? 0.5 : 1,
      transition: 'opacity 0.2s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <p style={{
            margin: 0, fontWeight: 500, color: '#111827',
            textDecoration: reminder.completed ? 'line-through' : 'none',
          }}>
            {reminder.title}
          </p>
          {reminder.description && (
            <p style={{ margin: '3px 0 0', color: '#6b7280', fontSize: 13 }}>{reminder.description}</p>
          )}
          <p style={{ margin: '6px 0 0', fontSize: 12, color: '#9ca3af' }}>
            Due {new Date(reminder.due_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
          <span style={{
            fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
            background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`,
            padding: '3px 10px', borderRadius: 20,
          }}>
            {reminder.effort}
          </span>
          <button
            onClick={() => onToggle(reminder.id, reminder.completed)}
            style={{
              padding: '4px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
              background: reminder.completed ? '#f9fafb' : '#f0fdf4',
              color: reminder.completed ? '#6b7280' : '#16a34a',
              border: `1px solid ${reminder.completed ? '#e5e7eb' : '#bbf7d0'}`,
              fontWeight: 500,
            }}
          >
            {reminder.completed ? 'Undo' : '✓ Done'}
          </button>
        </div>
      </div>
    </div>
  );
}

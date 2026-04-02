import Database from 'better-sqlite3';
import path from 'path';

let db;

export default function getDb() {
  if (!db) {
    db = new Database(path.join(process.cwd(), 'app.db'));
    db.pragma('foreign_keys = ON');
    db.pragma('journal_mode = WAL');
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        code TEXT UNIQUE NOT NULL,
        created_by INTEGER REFERENCES users(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS class_members (
        user_id INTEGER REFERENCES users(id),
        class_id INTEGER REFERENCES classes(id),
        PRIMARY KEY (user_id, class_id)
      );

      CREATE TABLE IF NOT EXISTS reminders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        due_date DATETIME NOT NULL,
        effort TEXT CHECK(effort IN ('low', 'medium', 'high')) NOT NULL,
        class_id INTEGER REFERENCES classes(id),
        created_by INTEGER REFERENCES users(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS completed_reminders (
        user_id INTEGER REFERENCES users(id),
        reminder_id INTEGER REFERENCES reminders(id),
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, reminder_id)
      );
    `);
  }
  return db;
}

# College Reminders

A full-stack student deadline manager with class-based access and a local task planner.

## Tech Stack
- **Next.js 14** — frontend + API routes (no separate backend needed)
- **SQLite** via `better-sqlite3` — database (auto-created as `app.db` on first run)
- **JWT** + **bcrypt** — authentication
- **Local scheduling algorithm** — no external API keys needed

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set your JWT secret** in `.env.local`:
   ```
   JWT_SECRET=any-long-random-string-you-choose
   ```

3. **Run the dev server**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

The SQLite database (`app.db`) is created automatically on first run — no setup needed.

## Features
- Register / login with email and password
- Create a class → get a unique 6-letter join code
- Share the code with classmates so they can join and see the same reminders
- Add reminders with a title, description, due date, and effort level (low / medium / high)
- Mark reminders as done (per-user, so your progress is your own)
- Task planner: enter how many days you have and a target date — get a day-by-day schedule built from your pending reminders

## Project Structure
```
app/
  api/               ← all backend API routes
  (auth)/            ← login + register pages
  dashboard/         ← lists your classes
  class/[classId]/   ← reminders for a class
  planner/           ← task schedule generator
components/          ← AuthProvider, ReminderCard, JoinClassModal, ScheduleView
lib/
  db.js              ← SQLite setup
  auth.js            ← JWT helpers
  planner.js         ← local scheduling algorithm
  api.js             ← client-side fetch wrapper
```

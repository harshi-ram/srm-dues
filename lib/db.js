import { createPool } from '@vercel/postgres';

// This automatically uses the POSTGRES_URL from your .env.local / Vercel Settings
const db = createPool();


export default db;

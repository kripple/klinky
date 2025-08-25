import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import type { Context } from '@/backend/context';

export function connectToDatabase(ctx: Context): AppDatabase {
  const sql = neon(ctx.connectionString);
  const db = drizzle({ client: sql });
  return db;
}

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

export function getDb(connectionString: string): AppDatabase {
  const sql = neon(connectionString);
  const db = drizzle({ client: sql });
  return db;
}

export const getOptionsHeaders = (allowedOrigins: string) =>
  ({
    'Access-Control-Allow-Origin': allowedOrigins,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }) as const;

export const getHeaders = (allowedOrigins: string) =>
  ({
    ...getOptionsHeaders(allowedOrigins),
    'Content-Type': 'application/json',
  }) as const;

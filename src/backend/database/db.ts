import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const connectionString = Netlify.env.get('DATABASE_URL');
if (!connectionString) throw Error('missing netlify env');

const sql = neon(connectionString);
export const db = drizzle({ client: sql });

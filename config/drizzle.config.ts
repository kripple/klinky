import { defineConfig } from 'drizzle-kit';

const db = 'src/backend/database' as const;

export default defineConfig({
  out: `${db}/migrations`,
  schema: `${db}/schema.ts`,
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});

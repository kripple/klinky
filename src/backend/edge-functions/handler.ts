// import { neon } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-http';
import type { Context } from '@netlify/edge-functions';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const allowedOrigins = Netlify.env.get('VITE_FRONTEND_URL');
const connectionString = Netlify.env.get('DATABASE_URL');
if (!allowedOrigins || !connectionString) throw Error('missing netlify env');

// const sql = neon(connectionString);
// const db = drizzle({ client: sql });
const hono = new Hono();

hono.use(
  '/*',
  cors({
    origin: allowedOrigins,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
  }),
);

// hono.get('/user/:id', async ({ req, json }) => {
//   const id = req.param('id');
//   const user = await db.getUserById(id);
//   return json(user);
// });

// hono.post('/user', async ({ req, json }) => {
//   const body = await req.json();
//   const newUser = await db.createUser(body);
//   return json(newUser, 201);
// });

export default async (
  request: Request,
  context: Context,
): Promise<Response> => {
  return hono.fetch(request, context);
};

import type { Context } from '@netlify/edge-functions';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { requestId } from 'hono/request-id';

import { links } from '@/backend/routes/links';
import { users } from '@/backend/routes/users';

const allowedOrigins = Netlify.env.get('VITE_FRONTEND_URL');
if (!allowedOrigins) throw Error('missing netlify env');

const app = new Hono();

app.use('*', requestId());

app.use(
  '*',
  cors({
    origin: allowedOrigins,
    allowMethods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PATCH'],
  }),
);

app.route('/users', users);

app.route('/users/:uuid/links', links);

app.onError((error, c) => {
  if (error.message === 'Bad Request') {
    return c.json({ error: error.message }, 400);
  }
  if (error.message === 'Not Found') {
    return c.json({ error: error.message }, 404);
  }
  // Fallback for unexpected errors
  console.error('Unhandled error: ', error);
  return c.json({ error: 'Internal Server Error' }, 500);
});

export default async (
  request: Request,
  context: Context,
): Promise<Response> => {
  return app.fetch(request, context);
};

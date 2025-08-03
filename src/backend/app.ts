import type { Context } from '@netlify/edge-functions';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { requestId } from 'hono/request-id';

import { unshorten } from '@/backend/controllers/links';
import { links } from '@/backend/routes/links';
import { users } from '@/backend/routes/users';
import { HttpStatus, HttpStatusCodes } from '@/utils/errors';

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

app.route('/users/:user_uuid/links', links);

app.get('/:alias', async (c) => {
  const alias = c.req.param('alias');
  const url = await unshorten(alias);
  return c.redirect(url);
});

app.onError((error, c) => {
  const errorMessage =
    error.message in HttpStatusCodes
      ? (error.message as keyof typeof HttpStatusCodes)
      : HttpStatus['500 Internal Server Error'];

  if (!(error.message in HttpStatusCodes)) {
    console.error('Unhandled error: ', error);
  }
  return c.json({ error: errorMessage }, HttpStatusCodes[errorMessage]);
});

export default async (
  request: Request,
  context: Context,
): Promise<Response> => {
  return app.fetch(request, context);
};

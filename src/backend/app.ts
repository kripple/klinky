import type { Context } from '@netlify/edge-functions';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { requestId } from 'hono/request-id';

import { linksController } from '@/backend/controllers/LinksController';
import { links } from '@/backend/routes/links';
import { users } from '@/backend/routes/users';
import { HttpStatus, HttpStatusCodes } from '@/utils/errors';

const allowedOrigins = Netlify.env.get('VITE_FRONTEND_URL');
if (!allowedOrigins) throw Error('missing netlify env');

const app = new Hono();

app.use(logger());
app.use('*', requestId());
app.use(
  '*',
  cors({
    origin: allowedOrigins,
    allowMethods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PATCH'],
  }),
);

app.route('/', users);

app.route('/', links);

app.get('/:alias', async (c) => {
  const params = c.req.param();
  const url = await linksController.unshorten(params);
  return c.redirect(url || '/');
});

app.onError((error, c) => {
  const errorMessage =
    error.message in HttpStatusCodes
      ? (error.message as keyof typeof HttpStatusCodes)
      : HttpStatus['500 Internal Server Error'];

  if (error.message in HttpStatusCodes) {
    console.error(error);
  } else {
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

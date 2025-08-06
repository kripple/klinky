import type { Context } from '@netlify/edge-functions';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';
import { requestId } from 'hono/request-id';

import { linksController } from '@/backend/controllers/LinksController';
import { links } from '@/backend/routes/links';
import { users } from '@/backend/routes/users';

const allowedOrigins = Netlify.env.get('VITE_FRONTEND_URL');
if (!allowedOrigins) throw Error('missing netlify env');

const api = new Hono();

api.use(logger());
api.use('*', requestId());
api.use(
  '*',
  cors({
    origin: allowedOrigins,
    allowMethods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PATCH'],
  }),
);

api.route('/', users);

api.route('/', links);

api.get('/:alias', async (c) => {
  const params = c.req.param();
  const url = await linksController.unshorten(params);
  return c.redirect(url || '/');
});

api.onError((error, c) => {
  if (!(error instanceof HTTPException)) {
    console.error('Unhandled error: ', error);
    return c.json('Internal Server Error', 500);
  } else {
    console.error(error);
    return c.json(null, error.status);
  }
});

export default async (
  request: Request,
  context: Context,
): Promise<Response> => {
  return api.fetch(request, context);
};

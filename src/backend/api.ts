import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';
import { requestId } from 'hono/request-id';

import type { Context } from '@/backend/context';
import { linksController } from '@/backend/controllers/LinksController';
import { createLinks } from '@/backend/routes/links';
import { createUsers } from '@/backend/routes/users';

export async function createApi({
  ctx,
  db,
}: {
  ctx: Context;
  db: AppDatabase;
}) {
  const api = new Hono();
  const links = createLinks({ db });
  const users = createUsers({ db });

  api.use(logger());
  api.use('*', requestId());
  api.use(
    '*',
    cors({
      origin: ctx.allowedOrigins,
      allowMethods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PATCH'],
    }),
  );

  api.route('/', users);

  api.route('/', links);

  api.get('/:alias', async (c) => {
    const params = c.req.param();
    const url = await linksController.unshorten({ ...params, db });
    return c.json({ url });
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

  return api;
}

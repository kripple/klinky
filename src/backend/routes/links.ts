import { Hono } from 'hono';

import {
  create,
  destroy,
  index,
  show,
  update,
} from '@/backend/controllers/links';

const links = new Hono();

links
  .get('/', async (c) => {
    const userUuid = c.req.param('user_uuid');
    const data = await index(userUuid);
    return c.json(data);
  })
  .post('/', async (c) => {
    const userUuid = c.req.param('user_uuid');
    const body = await c.req.json();
    const data = await create({ userUuid, data: body });
    return c.json(data, 201);
  })
  .get('/:link_uuid', async (c) => {
    const userUuid = c.req.param('user_uuid');
    const linkUuid = c.req.param('link_uuid');
    const data = await show({ userUuid, linkUuid });
    return c.json(data);
  })
  .patch('/:link_uuid', async (c) => {
    const userUuid = c.req.param('user_uuid');
    const linkUuid = c.req.param('link_uuid');
    const body = await c.req.json();
    const data = await update({ userUuid, linkUuid, data: body });
    return c.json(data);
  })
  .delete('/:link_uuid', async (c) => {
    const userUuid = c.req.param('user_uuid');
    const linkUuid = c.req.param('link_uuid');
    await destroy({ userUuid, linkUuid });
    return c.body(null, 204);
  });

export { links };

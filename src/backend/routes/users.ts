import { Hono } from 'hono';

import { create, destroy, show } from '@/backend/controllers/users';

const users = new Hono();

users
  .post('/', async (c) => {
    const user = await create();
    return c.json(user, 201);
  })
  .get('/:user_uuid', async (c) => {
    const userUuid = c.req.param('user_uuid');
    const user = await show(userUuid);
    return c.json(user);
  })
  .delete('/:user_uuid', async (c) => {
    const userUuid = c.req.param('user_uuid');
    await destroy(userUuid);
    return c.body(null, 204);
  });

export { users };

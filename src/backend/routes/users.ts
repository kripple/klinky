import { Hono } from 'hono';

import { create, destroy, show } from '@/backend/controllers/users';

const users = new Hono();

users
  .post('/', async (c) => {
    const user = await create();
    return c.json(user, 201);
  })
  .get('/:uuid', async (c) => {
    const uuid = c.req.param('uuid');
    const user = await show(uuid);
    return c.json(user);
  })
  .delete('/:uuid', async (c) => {
    const uuid = c.req.param('uuid');
    await destroy(uuid);
    return c.json(204);
  });

export { users };

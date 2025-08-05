import { Hono } from 'hono';

import { usersController } from '@/backend/controllers/UsersController';

const users = new Hono();

users
  .post('/users', async (c) => {
    const user = await usersController.create();
    return c.json(user, 201);
  })
  .get('/users/:user_uuid', async (c) => {
    const params = c.req.param();
    const user = await usersController.show(params);
    return c.json(user);
  })
  .delete('/users/:user_uuid', async (c) => {
    const params = c.req.param();
    await usersController.destroy(params);
    return c.body(null, 204);
  });

export { users };

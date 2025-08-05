import { Hono } from 'hono';

import { usersController } from '@/backend/controllers/UsersController';
import { serializeUser } from '@/backend/serializers/UserSerializer';

const users = new Hono();

users
  .post('/users', async (c) => {
    const user = await usersController.create();
    const dto = serializeUser(user);
    return c.json(dto, 201);
  })
  .get('/users/:user_uuid', async (c) => {
    const params = c.req.param();
    const user = await usersController.show(params);
    const dto = serializeUser(user);
    return c.json(dto);
  })
  .delete('/users/:user_uuid', async (c) => {
    const params = c.req.param();
    await usersController.destroy(params);
    return c.body(null, 204);
  });

export { users };

import { Hono } from 'hono';

import { linksController } from '@/backend/controllers/LinksController';

const links = new Hono();

links
  .get('/users/:user_uuid/links', async (c) => {
    const params = c.req.param();
    const data = await linksController.index(params);
    return c.json(data);
  })
  .post('/users/:user_uuid/links', async (c) => {
    const params = c.req.param();
    const body = await c.req.json();
    const data = await linksController.create({ ...params, ...body });
    return c.json(data, 201);
  })
  .get('/users/:user_uuid/links/:link_uuid', async (c) => {
    const params = c.req.param();
    const data = await linksController.show(params);
    return c.json(data);
  })
  .patch('/users/:user_uuid/links/:link_uuid', async (c) => {
    const params = c.req.param();
    const body = await c.req.json();
    const data = await linksController.update({ ...params, ...body });
    return c.json(data);
  })
  .delete('/users/:user_uuid/links/:link_uuid', async (c) => {
    const params = c.req.param();
    await linksController.destroy(params);
    return c.body(null, 204);
  });

export { links };

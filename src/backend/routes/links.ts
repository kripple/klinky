import { Hono } from 'hono';

import { linksController } from '@/backend/controllers/LinksController';
import { serializeLink } from '@/backend/serializers/LinkSerializer';

const links = new Hono();

links
  .get('/users/:user_uuid/links', async (c) => {
    const params = c.req.param();
    const links = await linksController.index(params);
    const dtos = links.map((link) => serializeLink({ ...link, ...params }));
    return c.json(dtos);
  })
  .post('/users/:user_uuid/links', async (c) => {
    const params = c.req.param();
    const body = await c.req.json();
    const link = await linksController.create({ ...params, ...body });
    const dto = serializeLink({ ...link, ...params });
    return c.json(dto, 201);
  })
  .get('/users/:user_uuid/links/:link_uuid', async (c) => {
    const params = c.req.param();
    const link = await linksController.show(params);
    const dto = serializeLink({ ...link, ...params });
    return c.json(dto);
  })
  .patch('/users/:user_uuid/links/:link_uuid', async (c) => {
    const params = c.req.param();
    const body = await c.req.json();
    const link = await linksController.update({ ...params, ...body });
    const dto = serializeLink({ ...link, ...params });
    return c.json(dto);
  })
  .delete('/users/:user_uuid/links/:link_uuid', async (c) => {
    const params = c.req.param();
    await linksController.destroy(params);
    return c.body(null, 204);
  })
  .delete('/users/:user_uuid/links', async (c) => {
    const params = c.req.param();
    await linksController.destroy_all(params);
    return c.body(null, 204);
  });

export { links };

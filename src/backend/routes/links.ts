import { Hono } from 'hono';

import { linksController } from '@/backend/controllers/LinksController';
import { serializeLink } from '@/backend/serializers/LinkSerializer';

export function createLinks({ db }: { db: AppDatabase }) {
  const links = new Hono();

  links
    .get('/users/:user_uuid/links', async (c) => {
      const params = c.req.param();
      const links = await linksController.index({ ...params, db });
      const dtos = links.map((link) => serializeLink({ ...link, ...params }));
      return c.json(dtos);
    })
    .post('/users/:user_uuid/links', async (c) => {
      const params = c.req.param();
      const body = await c.req.json();
      const link = await linksController.create({ ...params, ...body, db });
      const dto = serializeLink({ ...link, ...params });
      return c.json(dto, 201);
    })
    .get('/users/:user_uuid/links/:link_uuid', async (c) => {
      const params = c.req.param();
      const link = await linksController.show({ ...params, db });
      const dto = serializeLink({ ...link, ...params });
      return c.json(dto);
    })
    .patch('/users/:user_uuid/links/:link_uuid', async (c) => {
      const params = c.req.param();
      const body = await c.req.json();
      const link = await linksController.update({ ...params, ...body, db });
      const dto = serializeLink({ ...link, ...params });
      return c.json(dto);
    })
    .delete('/users/:user_uuid/links/:link_uuid', async (c) => {
      const params = c.req.param();
      await linksController.destroy({ ...params, db });
      return c.body(null, 204);
    })
    .delete('/users/:user_uuid/links', async (c) => {
      const params = c.req.param();
      await linksController.destroy_all({ ...params, db });
      return c.body(null, 204);
    });

  return links;
}

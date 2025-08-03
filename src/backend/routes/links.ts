import { Hono } from 'hono';

const links = new Hono();

links
  .get('/', async (c) => {
    const uuid = c.req.param('uuid');
    const data = await controller.index(uuid);
    return c.json(data);
  })
  .post('/', async (c) => {
    const uuid = c.req.param('uuid');
    const body = await c.req.json();
    const data = await controller.create(uuid, body);
    return c.json(data, 201);
  })
  .get('/:id', async (c) => {
    const uuid = c.req.param('uuid');
    const id = Number(c.req.param('id'));
    const data = await controller.show(uuid, id);
    return c.json(data);
  })
  .patch('/:id', async (c) => {
    const uuid = c.req.param('uuid');
    const id = Number(c.req.param('id'));
    const body = await c.req.json();
    const data = await controller.update(uuid, id, body);
    return c.json(data);
  })
  .delete('/:id', async (c) => {
    const uuid = c.req.param('uuid');
    const id = Number(c.req.param('id'));
    await controller.destroy(uuid, id);
    return c.body(null, 204);
  });

export { links };

import { type APIRequestContext, expect, test } from '@playwright/test';
import * as validator from 'uuid';

type Actual = ReturnType<typeof expect>;

export async function expectResponse({
  expectProps,
  method,
  request,
  path,
  data,
  expectedStatus = 200,
}: {
  expectProps?: { [key: string]: (e: Actual) => void };
  method: 'get' | 'post' | 'patch' | 'delete';
  request: APIRequestContext;
  path: string;
  data?: Record<string, any>;
  expectedStatus?: number;
}) {
  const url = `${process.env.VITE_BACKEND_URL}${path}`;
  const response = await request[method](url, data ? { data } : undefined);

  expect(response.status()).toBe(expectedStatus);

  if (expectedStatus !== 204) {
    const body = await response.json();
    expect(body).toBeTruthy();

    if (expectProps) {
      for (const [key, callbackFn] of Object.entries(expectProps)) {
        expect(body).toHaveProperty(key);
        callbackFn(body[key]);
      }
    }

    return body;
  }

  return null;
}

// POST   /users
// GET    /users/:uuid
// DELETE /users/:uuid

// GET    /users/:uuid/links
// POST   /users/:uuid/links
// GET    /users/:uuid/links/:link_id
// PATCH  /users/:uuid/links/:link_id
// DELETE /users/:uuid/links/:link_id

// GET    /:alias

test.describe('app', () => {
  // let uuid: string;
  // let linkId: string;
  // const alias = 'ex123';
  // const value = 'https://example.com';

  test('happy path', async ({ request }) => {
    // POST /users
    const user = await expectResponse({
      expectProps: {
        uuid: (prop) => expect(validator.validate(prop)).toBe(true),
        created_at: (prop) => expect(prop).toBeDefined(),
      },
      method: 'post',
      request,
      path: '/users',
      expectedStatus: 201,
    });

    // GET /users/:uuid
    await expectResponse({
      expectProps: {
        id: (prop) => expect(prop).toEqual(user.id),
        uuid: (prop) => expect(prop).toEqual(user.uuid),
        created_at: (prop) => expect(prop).toEqual(user.created_at),
      },
      method: 'get',
      request,
      path: `/users/${user.uuid}`,
    });

    // POST /users/:uuid/links
    // const link = await expectResponse({
    //   expectProps: {
    //     // alias: (e) => e.toEqual(alias),
    //     value: (e) => e.toEqual(value),
    //   },
    //   method: 'post',
    //   request,
    //   path: `/users/${uuid}/links`,
    //   data: { value },
    //   expectedStatus: 201,
    // });
    // linkId = link.uuid;

    // GET /users/:uuid/links
    // await expectResponse({
    //   expectProps: {
    //     length: (e) => e.toBeGreaterThan(0),
    //   },
    //   method: 'get',
    //   request,
    //   path: `/users/${uuid}/links`,
    // });

    // GET /users/:uuid/links/:link_id
    // await expectResponse({
    //   expectProps: {
    //     alias: (e) => e.toEqual(alias),
    //     value: (e) => e.toEqual(value),
    //   },
    //   method: 'get',
    //   request,
    //   path: `/users/${uuid}/links/${linkId}`,
    // });

    // PATCH /users/:uuid/links/:link_id
    // await expectResponse({
    //   expectProps: {
    //     alias: (e) => e.toEqual('updated'),
    //   },
    //   method: 'patch',
    //   request,
    //   path: `/users/${uuid}/links/${linkId}`,
    //   data: { alias: 'updated' },
    // });

    // GET /:alias (redirect)
    // const res = await request.get(`${process.env.VITE_API_URL}/updated`, {
    //   maxRedirects: 0,
    // });
    // expect(res.status()).toBe(302);
    // expect(res.headers()['location']).toEqual(value);

    // DELETE /users/:uuid/links/:link_id
    // await expectResponse({
    //   method: 'delete',
    //   request,
    //   path: `/users/${uuid}/links/${linkId}`,
    //   expectedStatus: 204,
    // });

    // DELETE /users/:uuid
    // await expectResponse({
    //   method: 'delete',
    //   request,
    //   path: `/users/${uuid}`,
    //   expectedStatus: 204,
    // });
  });
});

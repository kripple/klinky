import { type APIRequestContext, expect, test } from '@playwright/test';
import { nanoid } from 'nanoid';
import * as validator from 'uuid';

type Actual = ReturnType<typeof expect>;
const baseUrl = process.env.VITE_BACKEND_URL;

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
  const url = `${baseUrl}${path}`;
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

test.describe('app', () => {
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
    const customAlias = nanoid();
    const value = 'https://example.com';
    const defaultLink = await expectResponse({
      expectProps: {
        value: (prop) => expect(prop).toEqual(value),
      },
      method: 'post',
      request,
      path: `/users/${user.uuid}/links`,
      data: { value },
      expectedStatus: 201,
    });
    const link = await expectResponse({
      expectProps: {
        value: (prop) => expect(prop).toEqual(value),
        alias: (prop) => expect(prop).toEqual(customAlias),
      },
      method: 'post',
      request,
      path: `/users/${user.uuid}/links`,
      data: { value, alias: customAlias },
      expectedStatus: 201,
    });

    // GET /users/:uuid/links
    await expectResponse({
      expectProps: {
        length: (prop) => expect(prop).toBeGreaterThan(0),
      },
      method: 'get',
      request,
      path: `/users/${user.uuid}/links`,
    });

    // GET /users/:uuid/links/:link_id
    await expectResponse({
      expectProps: {
        alias: (prop) => expect(prop).toEqual(customAlias),
        value: (prop) => expect(prop).toEqual(value),
      },
      method: 'get',
      request,
      path: `/users/${user.uuid}/links/${link.uuid}`,
    });

    // PATCH /users/:uuid/links/:link_id
    const newCustomAlias = nanoid();
    await expectResponse({
      expectProps: {
        alias: (prop) => expect(prop).toEqual(newCustomAlias),
      },
      method: 'patch',
      request,
      path: `/users/${user.uuid}/links/${link.uuid}`,
      data: { alias: newCustomAlias },
    });

    // GET /:alias (redirect)
    const aliasResponse = await request.get(`${baseUrl}/${newCustomAlias}`, {
      maxRedirects: 0,
    });
    expect(aliasResponse.status()).toBe(302);
    expect(aliasResponse.headers()['location']).toEqual(value);

    // DELETE /users/:uuid/links/:link_id
    await expectResponse({
      method: 'delete',
      request,
      path: `/users/${user.uuid}/links/${link.uuid}`,
      expectedStatus: 204,
    });

    // DELETE /users/:uuid
    await expectResponse({
      method: 'delete',
      request,
      path: `/users/${user.uuid}`,
      expectedStatus: 204,
    });

    // deleting the user also deletes the user's links
    const afterDeleteResponse = await request.get(
      `${baseUrl}/${defaultLink.alias}`,
      {
        maxRedirects: 0,
      },
    );
    expect(afterDeleteResponse.status()).toBe(404);
  });
});

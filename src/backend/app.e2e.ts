import { type APIRequestContext, expect, test } from '@playwright/test';
import { nanoid } from 'nanoid';
import * as validator from 'uuid';

type Actual = ReturnType<typeof expect>;
const baseUrl = process.env.VITE_BACKEND_URL;

async function expectResponse({
  description,
  expectProps,
  method,
  request,
  path,
  data,
  expectedStatus = 200,
}: {
  description: string;
  expectProps?: { [key: string]: (e: Actual) => void };
  method: 'get' | 'post' | 'patch' | 'delete';
  request: APIRequestContext;
  path: string;
  data?: Record<string, any>;
  expectedStatus?: number;
}) {
  const url = `${baseUrl}${path}`;
  const response = await request[method](url, data ? { data } : undefined);

  expect(response.status(), description).toBe(expectedStatus);

  if (expectedStatus !== 204) {
    const body = await response.json();
    expect(body, description).toBeTruthy();

    if (expectProps) {
      for (const [key, callbackFn] of Object.entries(expectProps)) {
        expect(body, `${description} - .${key}`).toHaveProperty(key);
        callbackFn(body[key]);
      }
    }

    return body;
  }

  return null;
}

async function expectRedirect({
  description,
  path,
  request,
  goTo = '/',
}: {
  description: string;
  path: string;
  request: APIRequestContext;
  goTo?: string;
}) {
  const url = `${baseUrl}/${path}`;
  const response = await request.get(url, {
    maxRedirects: 0, // don't actually go to example.com
  });
  expect(response.status(), description).toBe(302);
  expect(response.headers()['location'], description).toEqual(goTo);
}

test.describe('app', () => {
  test('happy path', async ({ request }) => {
    const value = 'https://example.com';
    const customAlias = nanoid();
    const newCustomAlias = nanoid();
    expect(customAlias).not.toEqual(newCustomAlias);

    const user = await expectResponse({
      description: 'POST /users',
      expectProps: {
        uuid: (prop) => expect(validator.validate(prop)).toBe(true),
        created_at: (prop) => expect(prop).toBeDefined(),
      },
      method: 'post',
      request,
      path: '/users',
      expectedStatus: 201,
    });

    await expectResponse({
      description: 'GET /users/:user_uuid',
      expectProps: {
        id: (prop) => expect(prop).toEqual(user.id),
        uuid: (prop) => expect(prop).toEqual(user.uuid),
        created_at: (prop) => expect(prop).toEqual(user.created_at),
      },
      method: 'get',
      request,
      path: `/users/${user.uuid}`,
    });

    const defaultLink = await expectResponse({
      description: 'POST /users/:user_uuid/links',
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
      description: 'POST /users/:user_uuid/links (custom alias)',
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
    expect(link.created_at).toEqual(link.updated_at);

    await expectResponse({
      description: 'GET /users/:user_uuid/links',
      expectProps: {
        length: (prop) => expect(prop).toBeGreaterThan(0),
      },
      method: 'get',
      request,
      path: `/users/${user.uuid}/links`,
    });

    await expectResponse({
      description: 'GET /users/:user_uuid/links/:link_uuid',
      expectProps: {
        alias: (prop) => expect(prop).toEqual(customAlias),
        value: (prop) => expect(prop).toEqual(value),
      },
      method: 'get',
      request,
      path: `/users/${user.uuid}/links/${link.uuid}`,
    });

    await expectRedirect({
      request,
      path: customAlias,
      description: 'GET /:alias',
      goTo: value,
    });

    await expectResponse({
      description: 'PATCH /users/:user_uuid/links/:link_uuid',
      expectProps: {
        alias: (prop) => expect(prop).toEqual(newCustomAlias),
        updated_at: (prop) => expect(prop).not.toEqual(link.created_at),
      },
      method: 'patch',
      request,
      path: `/users/${user.uuid}/links/${link.uuid}`,
      data: { alias: newCustomAlias },
    });

    await expectRedirect({
      request,
      path: customAlias,
      description: 'verify original link no longer redirects',
    });

    await expectRedirect({
      request,
      path: newCustomAlias,
      description: 'verify new link is active',
      goTo: value,
    });

    await expectResponse({
      description: 'DELETE /users/:user_uuid/links/:link_uuid',
      method: 'delete',
      request,
      path: `/users/${user.uuid}/links/${link.uuid}`,
      expectedStatus: 204,
    });

    await expectRedirect({
      request,
      path: link.alias,
      description: 'verify link was deleted',
    });

    await expectResponse({
      description: 'DELETE /users/:user_uuid',
      method: 'delete',
      request,
      path: `/users/${user.uuid}`,
      expectedStatus: 204,
    });

    await expectRedirect({
      request,
      path: defaultLink.alias,
      description: 'deleting user also deletes user links',
    });
  });
});

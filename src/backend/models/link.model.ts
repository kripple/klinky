import { and, eq, sql } from 'drizzle-orm';

import { db } from '@/backend/database/db';
import { Link, NewLink } from '@/backend/database/schema/Link';
import { maxLinksPerUser } from '@/validators/link';

export const getLinks = async (userId: number) => {
  return db
    .select()
    .from(Link)
    .where(eq(Link.user_id, userId))
    .limit(maxLinksPerUser);
};

export const getLinkById = async ({
  userId,
  link_uuid,
}: {
  userId: number;
  link_uuid: string;
}) => {
  const link = (
    await db
      .select()
      .from(Link)
      .where(and(eq(Link.user_id, userId), eq(Link.uuid, link_uuid)))
  ).shift();
  return link;
};

export const getLinkByAlias = async (alias: string) => {
  const link = (
    await db.select().from(Link).where(eq(Link.alias, alias))
  ).shift();
  return link;
};

export const createLink = async ({
  user_id,
  alias,
  value,
}: Pick<NewLink, 'alias' | 'user_id' | 'value'>) => {
  const [link] = await db
    .insert(Link)
    .values({
      user_id,
      alias,
      value,
    })
    .returning();
  return link;
};

export const updateLink = async ({
  userId,
  link_uuid,
  alias,
}: {
  userId: number;
  link_uuid: string;
  alias: string;
}) => {
  const [link] = await db
    .update(Link)
    .set({ alias, updated_at: sql`now()` })
    .where(and(eq(Link.user_id, userId), eq(Link.uuid, link_uuid)))
    .returning();
  return link;
};

export const deleteLink = async ({
  userId,
  link_uuid,
}: {
  userId: number;
  link_uuid: string;
}) => {
  await db
    .delete(Link)
    .where(and(eq(Link.user_id, userId), eq(Link.uuid, link_uuid)));
};

export const deleteLinks = async ({ userId }: { userId: number }) => {
  await db.delete(Link).where(eq(Link.user_id, userId));
};

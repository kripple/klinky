import { and, eq, sql } from 'drizzle-orm';

import { Link, NewLink } from '@/backend/database/schema/Link';
import { maxLinksPerUser } from '@/validators/link';

export const getLinks = async ({
  db,
  userId,
}: {
  db: AppDatabase;
  userId: number;
}) => {
  return db
    .select()
    .from(Link)
    .where(eq(Link.user_id, userId))
    .limit(maxLinksPerUser);
};

export const getLinkById = async ({
  db,
  userId,
  link_uuid,
}: {
  db: AppDatabase;
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

export const getLinkByAlias = async ({
  alias,
  db,
}: {
  alias: string;
  db: AppDatabase;
}) => {
  const link = (
    await db.select().from(Link).where(eq(Link.alias, alias))
  ).shift();
  return link;
};

export const createLink = async ({
  db,
  user_id,
  alias,
  value,
}: Pick<NewLink, 'alias' | 'user_id' | 'value'> & { db: AppDatabase }) => {
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
  db,
  userId,
  link_uuid,
  alias,
}: {
  db: AppDatabase;
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
  db,
  userId,
  link_uuid,
}: {
  db: AppDatabase;
  userId: number;
  link_uuid: string;
}) => {
  await db
    .delete(Link)
    .where(and(eq(Link.user_id, userId), eq(Link.uuid, link_uuid)));
};

export const deleteLinks = async ({
  db,
  userId,
}: {
  db: AppDatabase;
  userId: number;
}) => {
  await db.delete(Link).where(eq(Link.user_id, userId));
};

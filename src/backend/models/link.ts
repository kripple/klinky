import { and, eq } from 'drizzle-orm';

import { db } from '@/backend/database/db';
import { Link, NewLink } from '@/backend/database/schema';

export const maxLinksPerUser = 10 as const;

export const getLinks = async (userId: number) => {
  return db
    .select()
    .from(Link)
    .where(eq(Link.user_id, userId))
    .limit(maxLinksPerUser);
};

export const getLinkById = async (userId: number, linkId: number) => {
  const [link] = await db
    .select()
    .from(Link)
    .where(and(eq(Link.user_id, userId), eq(Link.id, linkId)));
  return link;
};

export const createLink = async (data: NewLink) => {
  const [link] = await db.insert(Link).values(data).returning();
  return link;
};

export const updateLink = async (
  userId: number,
  linkId: number,
  data: Partial<NewLink>,
) => {
  const [link] = await db
    .update(Link)
    .set(data)
    .where(and(eq(Link.user_id, userId), eq(Link.id, linkId)))
    .returning();
  return link;
};

export const deleteLink = async (userId: number, linkId: number) => {
  await db
    .delete(Link)
    .where(and(eq(Link.user_id, userId), eq(Link.id, linkId)));
};

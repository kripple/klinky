import { and, eq, sql } from 'drizzle-orm';

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

export const getLinkById = async ({
  userId,
  linkUuid,
}: {
  userId: number;
  linkUuid: string;
}) => {
  const [link] = await db
    .select()
    .from(Link)
    .where(and(eq(Link.user_id, userId), eq(Link.uuid, linkUuid)));
  return link;
};

export const getLinkByAlias = async (alias: string) => {
  const [link] = await db.select().from(Link).where(eq(Link.alias, alias));
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
  linkUuid,
  data: { alias },
}: {
  userId: number;
  linkUuid: string;
  data: Partial<Pick<NewLink, 'alias'>>;
}) => {
  const [link] = await db
    .update(Link)
    .set({ alias, updated_at: sql`now()` })
    .where(and(eq(Link.user_id, userId), eq(Link.uuid, linkUuid)))
    .returning();
  return link;
};

export const deleteLink = async ({
  userId,
  linkUuid,
}: {
  userId: number;
  linkUuid: string;
}) => {
  await db
    .delete(Link)
    .where(and(eq(Link.user_id, userId), eq(Link.uuid, linkUuid)));
};

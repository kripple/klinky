import { eq } from 'drizzle-orm';

import { db } from '@/backend/database/db';
import { User } from '@/backend/database/schema';

export const createUser = async (): Promise<User> => {
  const [user] = await db.insert(User).values({}).returning();
  return user;
};

export const getUserByUuid = async (uuid: string): Promise<User | undefined> => {
  const [user] = await db.select().from(User).where(eq(User.uuid, uuid));
  return user;
};

export const deleteUserByUuid = async (uuid: string): Promise<void> => {
  await db.delete(User).where(eq(User.uuid, uuid));
};

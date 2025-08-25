import { eq } from 'drizzle-orm';

import { User } from '@/backend/database/schema/User';

export const createUser = async ({
  db,
}: {
  db: AppDatabase;
}): Promise<User> => {
  const [user] = await db.insert(User).values({}).returning();
  return user;
};

export const getUserByUuid = async ({
  db,
  uuid,
}: {
  db: AppDatabase;
  uuid: string;
}): Promise<User | undefined> => {
  const [user] = await db.select().from(User).where(eq(User.uuid, uuid));
  return user;
};

export const deleteUserByUuid = async ({
  db,
  uuid,
}: {
  db: AppDatabase;
  uuid: string;
}): Promise<void> => {
  await db.delete(User).where(eq(User.uuid, uuid));
};

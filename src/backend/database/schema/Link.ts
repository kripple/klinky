import {
  index,
  integer,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { User } from '@/backend/database/schema/User';

export const Link = pgTable(
  'links',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    uuid: uuid().defaultRandom().unique().notNull(),
    user_id: integer()
      .notNull()
      .references(() => User.id, { onDelete: 'cascade' }),
    value: varchar().notNull(),
    alias: varchar().notNull(),
    created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('link_uuid_idx').on(table.uuid),
    index('link_value_idx').on(table.value),
    uniqueIndex('link_alias_idx').on(table.alias),
    index('link_created_at_idx').on(table.created_at),
    index('link_updated_at_idx').on(table.updated_at),
  ],
);
export type Link = typeof Link.$inferSelect;
export type NewLink = typeof Link.$inferInsert;

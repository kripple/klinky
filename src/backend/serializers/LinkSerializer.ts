import type { Link } from '@/backend/database/schema/Link';

export function serializeLink(link: Link & { user_uuid: string }): LinkDto {
  return {
    uuid: link.uuid,
    user_uuid: link.user_uuid,
    created_at: link.created_at,
    updated_at: link.updated_at,
    alias: link.alias,
    value: link.value,
  };
}

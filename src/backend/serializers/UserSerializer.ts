import type { User } from '@/backend/database/schema/User';

export function serializeUser(user: User): UserDto {
  return {
    uuid: user.uuid,
    created_at: user.created_at,
  };
}

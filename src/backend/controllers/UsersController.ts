import {
  UserLinksController,
  type UserParams,
} from '@/backend/controllers/UserLinksController';
import { createUser, deleteUserByUuid } from '@/backend/models/user.model';

class UsersController extends UserLinksController {
  create = async () => {
    const user = await createUser();
    return user;
  };

  show = async ({ user_uuid }: UserParams) => {
    this.validate_uuid('user', user_uuid);
    const user = await this.get_user_or_404(user_uuid);
    return user;
  };

  destroy = async ({ user_uuid }: UserParams) => {
    this.validate_uuid('user', user_uuid);
    await deleteUserByUuid(user_uuid);
  };
}

export const usersController = new UsersController();
